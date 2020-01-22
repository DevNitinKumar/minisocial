const express = require("express");
const route = express.Router();
const userController = require("../controllers/userController");
const checkUserAuth = require("../data/middlewares/check-user");
const request = require('request');

/**
 * @swagger
 * /api/image_upload:
 *  post:    
 *    description: user login api
 *    parameters:
 *       - name: file
 *         description: file to be upload
 *         in: formData
 *         required: true
 *         type: file
 *    responses:
 *       200:
 *         description: successful response
*/
route.post("/image_upload",function(req,res) {
    userController.imageUpload(req,res,function(err,data) {
        if(err) {
            return res.status(200).json({ status: 200, success: false, message: "error in image uploading", data: null })
        }else{
            return res.status(200).json({ status: 200, success: true, message: "image uploaded successfully", data: data })
        }
    })
});



route.post("/image_upload_cloudinary", (req, res) => {  
    userController.imageUploadCloud(req,res,function(err,data) {
        if(err) {
            return res.status(200).json({ status: 200, success: false, message: err, data: null })
        }else{
            return res.status(200).json({ status: 200, success: true, message: "image uploaded successfully", data: data })
        }
    })  
});


route.post("/add_user_to_db",function(req,res) {
    userController.addUserToDB(req.body,function(err,data) {
        if(err) {
            return res.status(200).json({ status: 200, success: false, message: err, data: null })
        }else{
            return res.status(200).json({ status: 200, success: true, message: "user added to DB successfully", data: data })
        }
    })
});



route.post("/user_signup_checks",function(req,res) {
    userController.userSignupCheck(req.body,function(err,data) {
        if(err) {
            return res.status(200).json({ status: 200, success: false, message: err, data: null })
        }else{
            return res.status(200).json({ status: 200, success: true, message: "values checked successfully", data: null })
        }
    })
})


/**
 * @swagger
 * /api/user_signup:
 *  post:    
 *    description: user signup api
 *    parameters:
 *       - name: username
 *         description: username of user
 *         in: formData
 *         required: true
 *         type: string
 *       - name: email
 *         description: email of user
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: password of user
 *         in: formData
 *         required: true
 *         type: string
 *       - name: phone
 *         description: contact no of user
 *         in: formData
 *         type: string
 *       - name: address
 *         description: address of user
 *         in: formData
 *         type: string
 *       - name: dob
 *         description: dob of user
 *         in: formData
 *         type: string
 *       - name: profileImage
 *         description: profile image of user
 *         in: formData
 *         type: file
 *    responses:
 *       200:
 *         description: successful response
*/
route.post("/user_signup",function(req,res) {
    userController.userSignup(req.body,function(err,data) {
        if(err) {
            return res.status(200).json({ status: 200, success: false, message: err, data: null })
        }else{
            return res.status(200).json({ status: 200, success: true, message: "user registered successfully", data: null })
        }
    })
})

/**
 * @swagger
 * /api/user_login:
 *  post:    
 *    description: user login api
 *    parameters:
 *       - name: email
 *         description: user's email.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: user's password.
 *         in: formData
 *         required: true
 *         type: string
 *    responses:
 *       200:
 *         description: successful response
*/
route.post("/user_login",function(req,res) {
    userController.userLogin(req.body,function(err,data) {
        if(err) {
            return res.status(200).json({ status: 200, success: false, message: "error in user login", data: null })
        }else{
            return res.status(200).json({ status: 200, success: true, message: "user logged in successfully", data: data })
        }
    })
})


/**
 * @swagger
 * /api/user_forgot_pwd:
 *  post:    
 *    description: user forgot password api
 *    parameters:
 *       - name: email
 *         description: user's email
 *         in: formData
 *         required: true
 *         type: string
 *    responses:
 *       200:
 *         description: successful response
*/
route.post("/user_forgot_pwd",function(req,res) {
    userController.userForgotPwd(req.body,function(err,data) {
        if(err) {
            return res.status(200).json({ status: 200, success: false, message: err , data: null })
        }else{
            return res.status(200).json({ status: 200, success: true, message: "email sent successfully", data: data })
        }
    })
})


/**
 * @swagger
 * /api/get_user_by_name:
 *  post:
 *    security:              
 *     - Bearer: []     
 *    description: Use to request customers data by Name
 *    parameters:
 *       - name: username
 *         description: user's email
 *         in: formData
 *         required: true
 *         type: string
 *    responses:
 *       200:
 *         description: successful response
*/
route.post("/get_user_by_name",checkUserAuth.isAuthenticated ,function(req,res) {
    userController.getUserByName(req.body,req.decodedToken,function(err,data) {
        if(err) {
            return res.status(200).json({ status: 200, success: false, message: "error in getting user data", data: null })
        }else{
            return res.status(200).json({ status: 200, success: true, message: "user data fetched successfully", data: data })
        }
    })
})

/**
 * @swagger
 * /api/user_profile:
 *  get:
 *    security:              
 *     - Bearer: []     
 *    description: Use to request customers data
 *    responses:
 *       200:
 *         description: successful response
*/
route.get("/user_profile",checkUserAuth.isAuthenticated ,function(req,res) {
    userController.userProfile(req.decodedToken,function(err,data) {
        if(err) {
            return res.status(200).json({ status: 200, success: false, message: "error in getting user profile", data: null })
        }else{
            return res.status(200).json({ status: 200, success: true, message: "user profile fetched successfully", data: data })
        }
    })
})


/**
 * @swagger
 * /api/edit_user_profile:
 *  post:
 *    security:              
 *     - Bearer: []     
 *    description: Use to edit user profile
 *    parameters:
 *       - name: username
 *         description: user's username
 *         in: formData
 *         required: true
 *         type: string
 *       - name: address
 *         description: user's address
 *         in: formData
 *         required: true
 *         type: string
 *       - name: phone
 *         description: user's phone no
 *         in: formData
 *         required: true
 *         type: string
 *       - name: profileImage
 *         description: user's profile image
 *         in: formData
 *         required: true
 *         type: file
 *    responses:
 *       200:
 *         description: successful response
*/
route.post("/edit_user_profile",checkUserAuth.isAuthenticated ,function(req,res) {
    userController.editUserProfile(req.body,req.decodedToken,function(err,data) {
        if(err) {
            return res.status(200).json({ status: 200, success: false, message: err, data: null })
        }else{
            return res.status(200).json({ status: 200, success: true, message: data, data: null })
        }
    })
})


/**
 * @swagger
 * /api/get_all_users:
 *  get:
 *    security:              
 *     - Bearer: []     
 *    description: Use to get the list of all users
 *    responses:
 *       200:
 *         description: successful response
*/
route.get("/get_all_users",checkUserAuth.isAuthenticated ,function(req,res) {
    userController.getAllUsers(req.decodedToken,function(err,data) {
        if(err) {
            return res.status(200).json({ status: 200, success: false, message: err, data: null })
        }else{
            return res.status(200).json({ status: 200, success: true, message: "all users fetched successfully", data: data })
        }
    })
})


/**
 * @swagger
 * /api/follow_user:
 *  post:
 *    security:              
 *     - Bearer: []     
 *    description: used to follow another user
 *    parameters:
 *       - name: _id
 *         description: id of the user to be followed
 *         in: formData
 *         required: true
 *         type: string
 *    responses:
 *       200:
 *         description: successful response
*/
route.post("/follow_user",checkUserAuth.isAuthenticated ,function(req,res) {
    userController.followUser(req.body,req.decodedToken,function(err,data) {
        if(err) {
            return res.status(200).json({ status: 200, success: false, message: err, data: null })
        }else{
            return res.status(200).json({ status: 200, success: true, message: "user followed successfully", data: null })
        }
    })
})


/**
 * @swagger
 * /api/unfollow_user:
 *  post:
 *    security:              
 *     - Bearer: []     
 *    description: used to unfollow particular user
 *    parameters:
 *       - name: _id
 *         description: id of the user to be unfollowed
 *         in: formData
 *         required: true
 *         type: string
 *    responses:
 *       200:
 *         description: successful response
*/
route.post("/unfollow_user",checkUserAuth.isAuthenticated ,function(req,res) {
    userController.unfollowUser(req.body,req.decodedToken,function(err,data) {
        if(err) {
            return res.status(200).json({ status: 200, success: false, message: err, data: null })
        }else{
            return res.status(200).json({ status: 200, success: true, message: "user unfollowed successfully", data: null })
        }
    })
})


/**
 * @swagger
 * /api/clear_notification:
 *  post:
 *    security:              
 *     - Bearer: []     
 *    description: used to clear particular notification
 *    parameters:
 *       - name: _id
 *         description: id of notification to be cleared
 *         in: formData
 *         required: true
 *         type: string
 *    responses:
 *       200:
 *         description: successful response
*/
route.post("/clear_notification",checkUserAuth.isAuthenticated ,function(req,res) {
    userController.clearNotification(req.body,req.decodedToken,function(err,data) {
        if(err) {
            return res.status(200).json({ status: 200, success: false, message: err, data: null })
        }else{
            return res.status(200).json({ status: 200, success: true, message: "notification cleared successfully", data: null })
        }
    })
})


/**
 * @swagger
 * /api/mark_all_notification:
 *  post:
 *    security:              
 *     - Bearer: []     
 *    description: used to clear all notifications
 *    responses:
 *       200:
 *         description: successful response
*/
route.post("/mark_all_notification",checkUserAuth.isAuthenticated ,function(req,res) {
    userController.markAllNotifications(req.decodedToken,function(err,data) {
        if(err) {
            return res.status(200).json({ status: 200, success: false, message: err, data: null })
        }else{
            return res.status(200).json({ status: 200, success: true, message: "all notifications marked successfully", data: null })
        }
    })
})


route.post("/payment_checkout",checkUserAuth.isAuthenticated ,function(req,res) {
    userController.paymentCheckout(req.body,req.decodedToken,function(err,data) {
        if(err) {
            return res.status(200).json({ status: 200, success: false, message: err, data: null })
        }else{
            return res.status(200).json({ status: 200, success: true, message: "payment done successfully", data: data })
        }
    })
})


route.post("/patym_payment_checkout",checkUserAuth.isAuthenticated ,function(req,res) {
    userController.paytmPaymentCheckout(req.body,req.decodedToken,res,function(err,data) {
        if(err) {
            return res.status(200).json({ status: 200, success: false, message: err, data: null })
        }else{
            return res.status(200).json({ status: 200, success: true, message: "payment done successfully", data: data })
        }
    })
})


route.post("/payment-success",function(req,res) {
    userController.paytmPaymentSuccess(req.body,req,res,function(err,data) {
        if(err) {
            return res.status(200).json({ status: 200, success: false, message: err, data: null })
        }else{
            return res.status(200).json({ status: 200, success: true, message: "payment data fetched successfully", data: data })
        }
    })
})


route.post("/contact-admin",function(req,res) {
    userController.contactAdmin(req.body,function(err,data) {
        if(err) {
            return res.status(200).json({ status: 200, success: false, message: err, data: null })
        }else{
            return res.status(200).json({ status: 200, success: true, message: "message to admin sent successfully", data: data })
        }
    })
})


route.post("/send_otp",function(req,res) {
    userController.sendOTP(req.body,function(err,data) {
        if(err) {
            return res.status(200).json({ status: 200, success: false, message: err, data: null })
        }else{
            return res.status(200).json({ status: 200, success: true, message: "otp sent successfully", data: data })
        }
    })
})


route.post("/cancel_otp_req",function(req,res) {
    userController.cancelOtpReq(req.body,function(err,data) {
        if(err) {
            return res.status(200).json({ status: 200, success: false, message: err, data: null })
        }else{
            return res.status(200).json({ status: 200, success: true, message: "otp sent successfully", data: data })
        }
    })
})


route.post("/verify_otp",function(req,res) {
    userController.verifyOTP(req.body,function(err,data) {
        if(err) {
            return res.status(200).json({ status: 200, success: false, message: err, data: null })
        }else{
            return res.status(200).json({ status: 200, success: true, message: "otp verified successfully", data: null })
        }
    })
})


route.post("/verify_captcha",function(req,res) {
    request('https://www.google.com/recaptcha/api/siteverify?secret='+req.body.key+'&response='+req.body.resp, function(err,response,body){
        const resData = JSON.parse(body);
        if(resData.success) {
            return res.status(200).json({ status: 200, success: true, message: "captcha verified successfully", data: null })
        } else {
            return res.status(200).json({ status: 200, success: false, message: "captcha not verified", data: null }) 
        }
    })
});


route.post("/filter_follower",checkUserAuth.isAuthenticated,function(req,res) {
    userController.filterFollower(req.body,req.decodedToken,function(err,data) {
        if(err) {
            return res.status(200).json({ status: 200, success: false, message: err, data: null })
        }else{
            return res.status(200).json({ status: 200, success: true, message: "followers fetched successfully", data: data })
        }
    })
});



module.exports = route;


