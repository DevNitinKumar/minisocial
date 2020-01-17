const mongoose = require("mongoose");

const conversationSchema = mongoose.Schema({ 
    participants : [
        {
            senderId : { type : mongoose.Schema.Types.ObjectId , ref : 'Users' },
            receiverId : { type : mongoose.Schema.Types.ObjectId , ref : 'Users' },
        }
    ]
});

module.exports = mongoose.model("Conversations",conversationSchema);