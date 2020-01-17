const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Users'
    },
    postMsg : {
        type : String
    },
    postImage : {
        type : String,
        default : ""
    },
    userLocation : {
        type : String
    },
    totalLikes : {
        type : Number,
        default : 0
    },
    likedBy : [{
        username : {
            type : String
        },
        _id : false
    }],
    comments : [{
        username : {
            type : String
        },
        comment : {
            type : String
        },
        createdAt : {
            type : Number
        }
    }],
    createdAt : {
        type : Number
    }
});

module.exports = mongoose.model("Posts",postSchema);