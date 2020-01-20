const Constants = require("../data/Constants");
const Middleware = require("../data/middlewares/common-functions");
const Message = require("../data/message.model");
const Users = require("../data/users.model");
const Conversation = require("../data/conversation.model");
const Helper = require("../data/middlewares/helper");

exports.storeChatMessage = function(param,data,tokenData,callback) {
    Conversation.find({
        $or : [
            {
                participants : {
                    $elemMatch : { senderId : param.senderId , receiverId : param.receiverId }
                }
            },
            {
                participants : {
                    $elemMatch : { senderId : param.receiverId , receiverId : param.senderId }
                }
            }
        ]
    }, async(err, result) => {
        if(result.length > 0) {
            console.log(result[0]._id);
            const msg = await Message.findOne({conversationId : result[0]._id});
            await Helper.updateChatList(param,msg._id);

            await Message.update({"conversationId" : result[0]._id}, {
                $push : {
                    message : {
                        senderId : param.senderId,
                        receiverId : param.receiverId,
                        senderName : data.senderName,
                        receiverName : data.recName,
                        body : data.msg,
                        createdAt : new Date().getTime()
                    }
                }
            }).then((MsgSent) => {
                if(!MsgSent) {
                    return callback(Constants.MSG_NOT_SENT);
                }
                return callback(null,null)
            })
            .catch((err) => {
                console.log(err);
                return callback(Constants.COMMON_ERROR_MESSAGE);
            });
        } else {
            const newConversation = new Conversation();
            newConversation.participants.push({
                senderId : param.senderId,
                receiverId : param.receiverId
            })
            const savedCon = await newConversation.save();

            const newMessage = new Message();
            newMessage.conversationId = savedCon._id,
            newMessage.sender = data.senderName,
            newMessage.receiver = data.recName,
            newMessage.message.push({
                senderId : param.senderId,
                receiverId : param.receiverId,
                senderName : data.senderName,
                receiverName : data.recName,
                body : data.msg,
                createdAt : new Date().getTime()
            });

            await Users.update({"_id" : param.senderId}, {
                $push : {
                    chatList : {
                        $each : [
                            {
                                receiverId : param.receiverId,
                                msgId : newMessage._id
                            }
                        ],
                        $position : 0
                    }
                }
            });

            await Users.update({"_id" : param.receiverId}, {
                $push : {
                    chatList : {
                        $each : [
                            {
                                receiverId : param.senderId,
                                msgId : newMessage._id
                            }
                        ],
                        $position : 0
                    }
                }
            });

            await newMessage.save().then((saved) => {
                if(!saved) {
                    return callback(Constants.MSG_NOT_SAVED);
                }
                return callback(null,null)
            })
            .catch((err) => {
                console.log(err);
                return callback(Constants.COMMON_ERROR_MESSAGE);
            })
        }
    })
}


exports.getChatMessage = async function(param,tokenData,callback) {
    const conversation = await Conversation.findOne({
        $or : [
            {
                $and : [
                    { 'participants.senderId' : param.senderId },
                    { 'participants.receiverId' : param.receiverId },
                ]
            },
            {
                $and : [
                    { 'participants.senderId' : param.receiverId },
                    { 'participants.receiverId' : param.senderId },
                ]
            }
        ]
    }).select('_id');

    if(conversation) {
        Message.findOne({
            conversationId : conversation._id
        }).then((msgFound) => {
            if(!msgFound) {
                return callback(Constants.COMMON_ERROR_MESSAGE)
            }
            return callback(null,msgFound);
        })
        .catch((err) => {
            console.log(err);
            return callback(Constants.COMMON_ERROR_MESSAGE);
        })
    } else {
        return callback(null,null);
    }
}


exports.markChatMessage = async function(param,tokenData,callback) {
    const msg = await Message.aggregate([
        {
            $unwind : "$message"
        },
        {
            $match : {
                $and : [
                    { "message.senderName" : param.receiver , "message.receiverName" : param.sender}
                ]
            }
        }
    ]);
    if(msg.length > 0) {
        try {
            msg.forEach(async val => {
                await Message.update({
                    'message._id' : val.message._id
                },
                { 
                    $set : { 'message.$.isRead' : true} 
                })
            })
            return callback(null,null);
        } catch(err) {
            console.log(err)
            return callback(Constants.COMMON_ERROR_MESSAGE);
        }
    }
}


exports.markAllChatMessages = async function(param,tokenData,callback) {
    const msg = await Message.aggregate([
        {
            $match : { "message.receiverName" : param.receiver }
        },
        {
            $unwind : "$message"
        },
        {
            $match : { "message.receiverName" : param.receiver }
        }
    ]);
    if(msg.length > 0) {
        try {
            msg.forEach(async val => {
                await Message.update({
                    'message._id' : val.message._id
                },
                { 
                    $set : { 'message.$.isRead' : true} 
                })
            })
            return callback(null,null);
        } catch(err) {
            console.log(err)
            return callback(Constants.COMMON_ERROR_MESSAGE);
        }
    }
}
