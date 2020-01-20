const Constants = require("../data/Constants");
const multer = require("multer");
const Middleware = require("../data/middlewares/common-functions");
const CheckUserWare = require("../data/middlewares/check-user");
const Users = require("../data/users.model");
const Posts = require("../data/posts.model");


// adding new post
exports.addNewPost = function(data,tokenData,callback) {
   Users.findOne({"_id" : tokenData.userId})
   .then((userFound) => {
        if(!userFound){
            return callback(Constants.USER_ID_NOT_FOUND)
        }
        const postData = new Posts({
            postMsg : data.postMsg,
            postImage : data.postImage,
            userLocation : data.location,
            user : tokenData.userId,
            createdAt : new Date().getTime()
        });       
        postData.save().then(async (postAdded) => {
            if(!postAdded) {
                return callback(Constants.ERROR_IN_SAVING_POST)
            }
            await Users.update({ "_id" : tokenData.userId},{
                $push : {
                    posts : {
                        postId : postAdded._id,
                        post : data.postMsg,
                        createdAt : new Date().getTime()
                    }
                }
            })
            return callback(null,Constants.POST_ADDED);
        })
   }) 
}


// getting all posts
exports.getAllPosts = function(tokenData,callback) {
    Posts.find().populate('user',{ password : 0 }).then((posts) => {
        if(!posts) {
            return callback(Constants.ERROR_IN_FETCHING_POSTS)
        }
        posts.sort(function (x, y) {
            return y.createdAt - x.createdAt;
        })    
        return callback(null,posts)
    })
}


// adding likes to post
exports.postLiked = function(tokenData,data,callback) {
    console.log(data.username)
    Posts.updateOne(
        { "_id" : data.postData._id , "likedBy.username" : { $ne : data.username }},
        { $push : 
            { likedBy : 
                { username : data.username },
            },
            $inc : { totalLikes : 1}
        }).then((postLiked) => {
            if(!postLiked) {
                return callback(Constants.ERROR_IN_POST_LIKE);
            }
            return callback(null,Constants.POST_LIKED);
        })
}


// adding comment to post
exports.postComment = function(tokenData,fullData,callback) {
    // console.log(fullData.cmt);return;
    Posts.updateOne(
        { "_id" : fullData.data.postData._id },
        { $push : 
            { comments : 
                { username : fullData.data.username, comment : fullData.cmt , createdAt : new Date().getTime()},
            }
        }).then((postCmt) => {
            if(!postCmt) {
                return callback(Constants.ERROR_IN_POST_COMMENT);
            }
            return callback(null,Constants.POST_COMMENTED);
        })
}


// getting all comments
exports.getAllComments = function(tokenData,data,callback) {
    Posts.findOne({ "_id" : data.postData._id }).then((postData) => {
        if(!postData) {
            return callback(Constants.ERROR_IN_FETCHING_POSTS);
        }
        postData.comments.sort(function (x, y) {
            return y.createdAt - x.createdAt;
        })
        return callback(null,postData);
    })
}