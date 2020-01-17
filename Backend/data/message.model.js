const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({ 
    conversationId : { type : mongoose.Schema.Types.ObjectId , ref : 'Conversations' },
    sender : { type : String },
    receiver : { type : String },
    message : [
        {
            senderId : { type : mongoose.Schema.Types.ObjectId , ref : 'Users' },
            receiverId : { type : mongoose.Schema.Types.ObjectId , ref : 'Users' },
            senderName : { type : String },
            receiverName : { type : String },
            body : { type : String },
            isRead : { type : Boolean , default : false },
            createdAt : { type : Date }
        }
    ]
});

module.exports = mongoose.model("Messages",messageSchema);