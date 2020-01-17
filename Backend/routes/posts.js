const express = require("express");
const route = express.Router();
const Constants = require("../data/constants");
const userController = require("../controllers/userController");
const postController = require("../controllers/postController");
const checkUserAuth = require("../data/middlewares/check-user");


route.post("/add_new_post",checkUserAuth.isAuthenticated, function(req,res) {
    postController.addNewPost(req.body,req.decodedToken,function(err,data) {
        if(err) {
            return res.status(200).json({ status: 200, success: false, message: err, data: null })
        }else{
            return res.status(200).json({ status: 200, success: true, message: data, data: null })
        }
    })
})


route.get("/get_all_posts",checkUserAuth.isAuthenticated, function(req,res) {
    postController.getAllPosts(req.decodedToken,function(err,data) {
        if(err) {
            return res.status(200).json({ status: 200, success: false, message: err, data: null })
        }else{
            return res.status(200).json({ status: 200, success: true, message: "posts fetched successfully", data: data })
        }
    })
})


route.post("/post_liked",checkUserAuth.isAuthenticated, function(req,res) {
    postController.postLiked(req.decodedToken,req.body,function(err,data) {
        if(err) {
            return res.status(200).json({ status: 200, success: false, message: err, data: null })
        }else{
            return res.status(200).json({ status: 200, success: true, message: data, data: null })
        }
    })
})


route.post("/post_comment",checkUserAuth.isAuthenticated, function(req,res) {
    postController.postComment(req.decodedToken,req.body,function(err,data) {
        if(err) {
            return res.status(200).json({ status: 200, success: false, message: err, data: null })
        }else{
            return res.status(200).json({ status: 200, success: true, message: data, data: null })
        }
    })
})


route.post("/get_all_comments",checkUserAuth.isAuthenticated, function(req,res) {
    postController.getAllComments(req.decodedToken,req.body,function(err,data) {
        if(err) {
            return res.status(200).json({ status: 200, success: false, message: err, data: null })
        }else{
            return res.status(200).json({ status: 200, success: true, message: Constants.POST_FETCHED, data: data })
        }
    })
})


module.exports = route;