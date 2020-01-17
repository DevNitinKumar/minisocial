const express = require("express");
const route = express.Router();
const msgController = require("../controllers/msgController");
const checkUserAuth = require("../data/middlewares/check-user");


route.post("/send_chat_message/:senderId/:receiverId",checkUserAuth.isAuthenticated ,function(req,res) {
    msgController.storeChatMessage(req.params,req.body,req.decodedToken,function(err,data) {
        if(err) {
            return res.status(200).json({ status: 200, success: false, message: err, data: null })
        }else{
            return res.status(200).json({ status: 200, success: true, message: "message sent successfully", data: null })
        }
    })
})


route.get("/get_chat_message/:senderId/:receiverId",checkUserAuth.isAuthenticated ,function(req,res) {
    msgController.getChatMessage(req.params,req.decodedToken,function(err,data) {
        if(err) {
            return res.status(200).json({ status: 200, success: false, message: err, data: null })
        }else{
            return res.status(200).json({ status: 200, success: true, message: "message fetched successfully", data: data })
        }
    })
})


route.post("/mark_chat_messages/:sender/:receiver",checkUserAuth.isAuthenticated ,function(req,res) {
    msgController.markChatMessage(req.params,req.decodedToken,function(err,data) {
        if(err) {
            return res.status(200).json({ status: 200, success: false, message: err, data: null })
        }else{
            return res.status(200).json({ status: 200, success: true, message: "message marked successfully", data: null })
        }
    })
})


route.post("/mark_all_chat_messages/:receiver",checkUserAuth.isAuthenticated ,function(req,res) {
    msgController.markAllChatMessages(req.params,req.decodedToken,function(err,data) {
        if(err) {
            return res.status(200).json({ status: 200, success: false, message: err, data: null })
        }else{
            return res.status(200).json({ status: 200, success: true, message: "message marked successfully", data: null })
        }
    })
})


module.exports = route;
