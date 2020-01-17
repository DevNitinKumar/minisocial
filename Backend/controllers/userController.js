const Constants = require("../data/constants");
const multer = require("multer");
const Middleware = require("../data/middlewares/common-functions");
const CheckUserWare = require("../data/middlewares/check-user");
const Users = require("../data/users.model");
const bcrypt = require("bcrypt");
const CommonFun = require("../data/middlewares/common-functions");
const paypal = require('paypal-rest-sdk');
const cheerio = require('cheerio');
const url = require('url');
const checksum_lib = require('../data/paytm-payment/checksum/checksum');
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AfyHKbfTBvcLrCThwwdkA9SK3LdhzLEbUJABiV3_xEgSy2A5qeA7MgjeUBH_nhT2P1gGcbBRoX62hwz1',
    'client_secret': 'ELWpqciz-I5uyHHi2-KfM7LyUR4KBkzxCsp_QVbeCIEPULGw91KIh1iH-uSDyLB6JV_dgSgudltgNw5D'
});
const Nexmo = require('nexmo');
const nexmo = new Nexmo({
    apiKey: 'd089bd9d',
    apiSecret: 'r0jOEDoLDDVwUNo0',
    applicationId: 'edfd943c-6d36-484c-aabf-ab438c4699ee',
    privateKey: '/Users/shashankpanwar/Documents/angularChatApp/angularChat/Backend/data/middlewares/private.key'
});
const from = 'Nitin Kumar';
const to = '917988580827';
const text = 'Payment Successful';
// hi-IN , en-IN

exports.imageUpload = function (req, res, callback) {
    const MIME_TYPES_ALLOWED = {
        'image/png': 'png',
        'image/jpeg': 'jpeg',
        'image/jpg': 'jpg',
        'image/gif': 'gif'
    }
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            if (!MIME_TYPES_ALLOWED[file.mimetype]) {
                return callback(Constants.IMAGE_TYPES_ALLOWED)
            }
            cb(null, './Backend/data/uploads')
        },
        filename: function (req, file, cb) {
            // let fileName = (file.originalname).split(' ').join('_');
            const ext = MIME_TYPES_ALLOWED[file.mimetype];
            let fileName = "userimage_" + new Date().getTime() + ext;
            cb(null, fileName)
        }
    })
    const upload = multer({ storage: storage }).single('file');
    upload(req, res, (err) => {
        if (err) {
            console.log(err)
            return callback(Constants.IMAGE_UPLOADING_ERROR);
        }
        // Middleware.deleteImageFromLocall(req.file);
        return callback(null, req.file.path);
    })
}


exports.userSignup = function (data, callback) {
    // const url = req.protocol + "://" + req.get("host");
    if (data.username === "" || data.email === "" || data.password === "") {
        return callback(Constants.FIELD_REQUIRED);
    }
    isEmailValid = Middleware.validateEmail(data.email); // check regex for email
    if (!isEmailValid) {
        return callback(Constants.EMAIL_FORMAT)
    }

    Users.find({ 'email': data.email.toLowerCase().trim() }).countDocuments()  // email already exist check
        .then((result) => {
            if (result > 0) {
                return callback(Constants.EMAIL_EXISTS)
            }
            Users.find({ 'username': data.username.toLowerCase().trim() }).countDocuments()  // username already exist check
                .then((result) => {
                    if (result > 0) {
                        return callback(Constants.USERNAME_EXISTS)
                    }
                    bcrypt.hash(data.password, 10)  // encrypting user password
                        .then(hash => {
                            const userData = new Users({
                                username: data.username.toLowerCase().trim(),
                                email: data.email.toLowerCase().trim(),
                                password: hash,
                                address: data.address,
                                phone: data.phone,
                                profileImage: data.profileImage,
                                dob: data.dob,
                                createdAt: new Date().getTime()
                            })
                            userData.save()
                                .then((result) => {
                                    if (!result) {
                                        return callback(Constants.COMMON_ERROR_MESSAGE);
                                    }
                                    return callback(null, null)
                                })
                                .catch((err) => {
                                    console.log(err)
                                    return callback(Constants.COMMON_ERROR_MESSAGE)
                                })
                        })
                        .catch((err) => {
                            console.log(err)
                            return callback(Constants.COMMON_ERROR_MESSAGE)
                        })
                })
        })
}


exports.userForgotPwd = function (data, callback) {
    const pwd = CommonFun.generatePassword(10);
    console.log(pwd);
    Users.findOne({ "email": data.email })
        .then((userFound) => {
            if (!userFound) {
                return callback(Constants.EMAIL_NOT_FOUND);
            }
            let emailData = "<html><head></head><body>Your password has been reset successfully.<br/>Your New Password is : <b>" + pwd + "</b>.You can change your password after login.<br /><br/>Thank You<br />Team Chat App<br /><span style='font-size:12px'>IT Park, Mohali, Punjab</span></body></html>"
            CommonFun.transporter.sendMail({
                to: data.email,
                subject: "Chat App New Password",
                html: emailData,
            }).then(mail => {
                bcrypt.hash(pwd, 10).then(hash => {
                    console.log(hash)
                    Users.update({ "email": data.email }, { "password": hash })
                        .then((updated) => {
                            if (!updated) {
                                return callback(Constants.COMMON_ERROR_MESSAGE)
                            }
                            return callback(null, Constants.EMAIL_SENT)
                        })
                        .catch(err => {
                            console.log(err)
                            return callback(Constants.COMMON_ERROR_MESSAGE)
                        });
                })
            }).catch(err => {
                console.log(err)
                return callback(Constants.COMMON_ERROR_MESSAGE)
            });
        })
        .catch((err) => {
            console.log(err)
            return callback(Constants.COMMON_ERROR_MESSAGE)
        })
}


exports.userLogin = function (data, callback) {
    let fetchedUser;
    Users.findOne({ $or: [{ email: data.email.toLowerCase().trim() }, { username: data.email.toLowerCase().trim() }] })  // check for login with email or username
        .then((userFound) => {
            if (!userFound) {
                return callback(Constants.USER_NOT_FOUND)
            }
            fetchedUser = userFound;
            return bcrypt.compare(data.password, userFound.password);  // password comparison
        })
        .then((result) => {
            if (!result) {
                return callback(Constants.USER_NOT_FOUND)
            }
            const data = { email: fetchedUser.email, userId: fetchedUser._id, username: fetchedUser.username };
            const token = CheckUserWare.generateToken(data);
            return callback(null, { token: token })
        })
        .catch(error => {
            return callback(error)
        })
}


exports.getUserByName = function (data, tokenData, callback) {
    Users.findOne({ "username": data.username }, { password: 0 })
        .then((data) => {
            if (!data) {
                return callback(Constants.USER_ID_NOT_FOUND)
            }
            data.notifications.sort(function (x, y) {
                return y.createdAt - x.createdAt;
            })
            return callback(null, data)
        })
}


exports.userProfile = function (tokenData, callback) {
    Users.findOne({ "_id": tokenData.userId }, { password: 0 })
        .populate('following.userFollowedId', { email: 1, address: 1, profileImage: 1, username: 1 })
        .populate('followers.followerId', { email: 1, address: 1, profileImage: 1, username: 1 })
        .populate('notifications.senderId', { email: 1, address: 1, profileImage: 1, username: 1 })
        .populate('chatList.receiverId', { email: 1, address: 1, profileImage: 1, username: 1 })
        .populate('chatList.msgId')
        .then((data) => {
            if (!data) {
                return callback(Constants.USER_ID_NOT_FOUND)
            }
            data.notifications.sort(function (x, y) {
                return y.createdAt - x.createdAt;
            })
            return callback(null, data)
        })
}


exports.editUserProfile = function (data, tokenData, callback) {
    Users.findOne({ "_id": tokenData.userId }).then((res) => {
        if (!res) {
            return callback(Constants.USER_ID_NOT_FOUND);
        }
        const userData = {
            username: data.username,
            phone: data.phone,
            address: data.address,
            profileImage: data.profileImage
        }
        Users.findByIdAndUpdate({ "_id": tokenData.userId }, userData).then((updated) => {
            if (!updated) {
                return callback(Constants.PROFILE_NOT_UPDATED);
            }
            return callback(null, Constants.PROFILE_UPDATED)
        })
            .catch((err) => {
                console.log(err);
                return callback(null, Constants.PROFILE_NOT_UPDATED)
            })
    })
}


exports.getAllUsers = function (tokenData, callback) {
    Users.find({ "_id": { $ne: tokenData.userId } }, { password: 0 }, function (err, data) {
        if (err) {
            return callback(Constants.USER_ID_NOT_FOUND)
        }
        return callback(null, data)
    })
}


exports.followUser = function (data, tokenData, callback) {
    Users.findOne({ "_id": tokenData.userId })
        .then((userData) => {
            if (!userData) {
                return callback(Constants.USER_ID_NOT_FOUND)
            }
            const FollowUser = async () => {
                await Users.update({ "_id": tokenData.userId, "following.userFollowedId": { $ne: data._id } }, {
                    $push: {
                        following: {
                            userFollowedId: data._id
                        }
                    }
                });

                await Users.update({ "_id": data._id, "followers.followerId": { $ne: tokenData.userId } }, {
                    $push: {
                        followers: {
                            followerId: tokenData.userId
                        },
                        notifications: {
                            senderId: tokenData.userId,
                            message: `${userData.username} has started following you`,
                            createdAt: new Date().getTime(),
                            date: new Date().getTime()
                        }
                    }
                });
            }

            FollowUser()
                .then(() => {
                    return callback(null, null)
                })
                .catch((err) => {
                    console.log(err)
                    return callback(Constants.USER_NOT_FOLLOWED)
                })
        })
        .catch((err) => {
            console.log(err)
            return callback(Constants.USER_ID_NOT_FOUND)
        })
}


exports.unfollowUser = function (data, tokenData, callback) {
    const UnfollowUser = async () => {
        await Users.update({ "_id": tokenData.userId }, {
            $pull: {
                following: {
                    userFollowedId: data._id
                }
            }
        });

        await Users.update({ "_id": data._id }, {
            $pull: {
                followers: {
                    followerId: tokenData.userId
                }
            }
        });
    }

    UnfollowUser()
        .then(() => {
            return callback(null, null)
        })
        .catch((err) => {
            console.log(err)
            return callback(Constants.USER_NOT_UNFOLLOWED)
        })
}


exports.clearNotification = function (data, tokenData, callback) {
    Users.findOne({ "_id": tokenData.userId })
        .then((userData) => {
            if (!userData) {
                return callback(Constants.USER_ID_NOT_FOUND)
            }
            if (data.deleteNoification === undefined) {
                Users.update({ "_id": tokenData.userId, 'notifications._id': data.id }, {
                    $set: {
                        'notifications.$.isRead': true
                    }
                }).then((cleared) => {
                    if (!cleared) {
                        return callback(Constants.UPDATE_NOTIFICATION_ERROR)
                    }
                    return callback(null, null)
                }).catch((err) => {
                    console.log(err)
                    return callback(Constants.UPDATE_NOTIFICATION_ERROR)
                })
            } else {
                Users.update({ "_id": tokenData.userId, 'notifications._id': data.id }, {
                    $pull: {
                        notifications: {
                            _id: data.id
                        }
                    }
                }).then((cleared) => {
                    if (!cleared) {
                        return callback(Constants.UPDATE_NOTIFICATION_ERROR)
                    }
                    return callback(null, null)
                }).catch((err) => {
                    console.log(err)
                    return callback(Constants.UPDATE_NOTIFICATION_ERROR)
                })
            }
        })
}


exports.markAllNotifications = function (tokenData, callback) {
    Users.findOne({ "_id": tokenData.userId })
        .then((userData) => {
            if (!userData) {
                return callback(Constants.USER_ID_NOT_FOUND)
            }
            Users.update({ "_id": tokenData.userId },
                { $set: { 'notifications.$[elem].isRead': true } },
                { arrayFilters: [{ 'elem.isRead': false }], multi: true })
                .then((cleared) => {
                    if (!cleared) {
                        return callback(Constants.UPDATE_NOTIFICATION_ERROR)
                    }
                    return callback(null, null)
                }).catch((err) => {
                    console.log(err)
                    return callback(Constants.UPDATE_NOTIFICATION_ERROR)
                })
        })
}


exports.paymentCheckout = function (data, tokenData, callback) {
    console.log(data);
    const execute_payment_json = {
        "payer_id": data.payerId,
        "transactions": [{
            "amount": {
                "currency": "INR",
                "total": "25.00"
            }
        }]
    }
    paypal.payment.execute(data.paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error)
            return callback(Constants.COMMON_ERROR_MESSAGE)
        } else {
            return callback(null, payment)
        }
    });
}


exports.paytmPaymentCheckout = function (data, token, res, callback) {
    let paytmParams = {};
    paytmParams['MID'] = 'olTGYX58735329908004';
    paytmParams['WEBSITE'] = 'WEBSTAGING';
    paytmParams['INDUSTRY_TYPE_ID'] = 'Retail';
    paytmParams['CHANNEL_ID'] = 'WEB';
    paytmParams['ORDER_ID'] = Middleware.generatePassword(10);
    paytmParams['CUST_ID'] = 'CUST002';
    paytmParams['MOBILE_NO'] = '7988582058';
    paytmParams['EMAIL'] = 'nitin.kumar@kayosys.com';
    paytmParams['TXN_AMOUNT'] = data.amt.toString();
    paytmParams['CALLBACK_URL'] = 'http://localhost:3800/api/payment-success';

    checksum_lib.genchecksum(paytmParams, "6jDvdgOXJJCOWo&Y", function (err, checksum) {
        if (err) {
            return callback(Constants.ERROR_IN_PAYTM_PAYMENT);
        }
        const url = "https://securegw-stage.paytm.in/theia/processTransaction";
        const data = {
            url: url,
            checksum: checksum
        }
        return callback(null, { data, paytmParams })
    });
}


exports.paytmPaymentSuccess = function (data, req, res, callback) {
    if (data.RESPCODE === '01') {        
        // const ncco = [
        //     {
        //       action: 'talk',
        //       voiceName: 'Aditi',
        //       level: 1,
        //       loop: 10,
        //       text: '<speak><lang xml:lang="hi-IN">Hello Nitin, Your payment has been done successfully.<break time="1s"/> ThankYou!</lang></speak>',
        //     },
        // ];
        // nexmo.message.sendSms(from, to, text);
        // nexmo.calls.create(
        //     {
        //       to: [{ type: 'phone', number: '917988580827' }],
        //       from: { type: 'phone', number: '917988580827' },
        //       ncco,
        //     },
        //     (err, result) => {
        //       console.log(err || result);
        //     },
        // );
        return res.redirect(url.format({
            pathname: "http://localhost:4000/paytm-payment-success",
            query: {
                "currency": data.CURRENCY,
                "gateway": data.GATEWAYNAME,
                "resmsg": data.RESPMSG.toString(),
                "bankname": data.BANKNAME.toString(),
                "paymode": data.PAYMENTMODE.toString(),
                "mid": data.mid,
                "rescode": data.RESPCODE,
                "txnId": data.TXNID,
                "amount": data.TXNAMOUNT,
                "orderId": data.ORDERID,
                "bankTxnId": data.BANKTXNID,
                "txnDate": new Date(data.TXNDATE).getTime()
            }
        }));
    } else {
        return res.redirect(url.format({
            pathname: "http://localhost:4000/paytm-payment-success",
            query: {
                "currency": data.CURRENCY,
                "gateway": '',
                "resmsg": data.RESPMSG.toString(),
                "bankname": '',
                "paymode": '',
                "mid": data.mid,
                "rescode": data.RESPCODE,
                "txnId": data.TXNID,
                "amount": data.TXNAMOUNT,
                "orderId": data.ORDERID,
                "bankTxnId": data.BANKTXNID,
                "txnDate": ''
            }
        }));
    }

}


exports.contactAdmin = function (data, callback) {
    nexmo.message.sendSms(from, to, text);
    return callback(null, null);
}


exports.sendOTP = function (data, callback) {
    nexmo.verify.request({
        number: data.phone.toString(),
        brand: 'App Verification',
        country: 'IN',
        pin_expiry: 60,
        workflow_id: 6  
    }, (err, result) => {
        if (err) {
            console.error(err);
            return callback(Constants.COMMON_ERROR_MESSAGE)
        } else {
            console.log(result);
            if (result.status === '0') {
                const verifyRequestId = result.request_id;
                return callback(null, verifyRequestId);
            } else {
                return callback(result.error_text);
            }
        }
    });
}


exports.cancelOtpReq = function(data,callback) {
    nexmo.verify.control({
        request_id: data.reqId,
        cmd: 'cancel'
    }, (err, result) => {
        if (err) {
            console.error(err);
            return callback(Constants.COMMON_ERROR_MESSAGE);
        } else {
            console.log(result);
            if(result.status === 0) {
                return callback(null,null);
            } else {
                return callback(result.error_text);
            }
        }
    });
}


exports.verifyOTP = function(data, callback) {
    if (data.reqId === '' || data.reqId === undefined) {
        return callback(Constants.REQ_ID_NOT_FOUND);
    }
    nexmo.verify.check({
        request_id: data.reqId,
        code: data.otp
    }, (err, result) => {
        if (err) {
            console.error(err);
            callback(Constants.COMMON_ERROR_MESSAGE);
        } else {
            console.log(result);
            if(result.status === '0') {
                return callback(null,null);
            } else {
                return callback(result.error_text);
            }
        }
    });
}


exports.filterFollower = async function(data,tokenData,callback) {
    let finalArray = [];
    await Users.findOne({"_id" : tokenData.userId})
    .populate('followers.followerId', { email: 1, address: 1, profileImage: 1, username: 1 })
    .then((res) => {
        res.followers.forEach(el => {
            if (el.followerId.username.includes(data.text.toLowerCase())) {
                finalArray.push(el);
            }
        });
        return callback(null,finalArray);
    })
    .catch(err => {
        console.log(err);
        return callback(Constants.COMMON_ERROR_MESSAGE);
    })
}

