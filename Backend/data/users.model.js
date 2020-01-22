const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username : {
        type : String
    },
    email : {
        type : String
    },
    googleId : {
        type : String,
        default : ''
    },
    password : {
        type : String
    },
    dob : {
        type : String
    },
    address : {
        type : String
    },
    phone : {
        type : String
    },
    profileImage : {
        type : String,
        default : ""
    },
    createdAt : {
        type : Number
    },
    posts : [{
        postId : { type : mongoose.Schema.Types.ObjectId,ref : 'Posts' },
        post : { type : String },
        createdAt : { type : Number }
    }],
    following : [{
        userFollowedId : {  type : mongoose.Schema.Types.ObjectId , ref : 'Users' }
    }],
    followers : [{
        followerId : { type : mongoose.Schema.Types.ObjectId , ref : 'Users' }
    }],
    notifications : [{
        senderId : { type : mongoose.Schema.Types.ObjectId , ref : 'Users' },
        message : { type : String },
        createdAt : { type : Date },
        isRead : { type : Boolean , default : false},
        isProfileViewed : { type : Boolean , default : false},
        date : { type : Date }
    }],
    chatList : [{
        receiverId : { type : mongoose.Schema.Types.ObjectId , ref : 'Users' },
        msgId : { type : mongoose.Schema.Types.ObjectId , ref : 'Messages' }
    }]
})

module.exports = mongoose.model("Users",userSchema);