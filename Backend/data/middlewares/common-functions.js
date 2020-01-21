const nodemailer = require("nodemailer");
const Constants = require("../constants");
const fs = require("fs");


// send mail start
module.exports.transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: "nitin.kumar@kayosys.com",
        pass: "React4J$" //"uPQ*95uU"
    }
});
// end

module.exports.emailFormat = '<html><head><title></title><link href="https://svc.webspellchecker.net/spellcheck31/lf/scayt3/ckscayt/css/wsc.css" rel="stylesheet" type="text/css" /></head><body aria-readonly="false">Hello <br /><br />Please click on the below link to reset your password:<br /><br /><em>#forgotPage</em><br /><br />Thank You<br />Team Insurance App<br /><span style="font-size:10px">Meleno park, California US.</span></body></html>';


// generating random string
module.exports.generatePassword = function(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@-';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
//end
 

//remove images from localFolder
module.exports.deleteImageFromLocall = function (fileName) {
    fs.unlink('./Backend/data/uploads/' + fileName, function (err) {
        if (!err) {
            console.log(Constants.FILE_DELETED);
        } else {
            console.log(Constants.FILE_DELETION_ERROR, err);
        }
    });
}
//end


// date format conversion
module.exports.formatDate = function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = '' + d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return day + "" + month + "" + year;
}
// end


// email regex
module.exports.validateEmail = function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
// end


// username regex
module.exports.validateUsername = function validateUsername(username) {
    var re = /^[a-z0-9]{3,16}$/;
    return re.test(String(username).toLowerCase());
}
// end



// to send Notification 
const FCM = require('fcm-node');
const serverKey = 'AIzaSyB-cBomg4dOdfwtlLVD_bmIs4UMg2Nuu20'; //put your server key here
const fcm = new FCM(serverKey);

module.exports.genericPushNotification = function (token, msg,type,status,deviceType) {
    if (token !== null) {
        if(deviceType === "iOS"){
            var message = {
                to: token,
                notification: {
                    title: 'Insurance App',
                    body: msg,
                    type: type,
                    sound: 'default'
                },
                data: { //you can send only notification or only data(or include both)
                    title: 'Insurance App',
                    body: msg,
                    type: type,
                    status: status
                },
                "content_available": true
            };
        }else{
            var message = {
                to: token,
                data: { //you can send only notification or only data(or include both)
                    title: 'Insurance App',
                    body: msg,
                    type: type,
                    status: status
                },
                "content_available": true
            };
        }       
        fcm.send(message, function (err, response) {
            if (err) {
                console.log(err)
            } else {
                console.log(response)
            }
        });
    }
}
//end
