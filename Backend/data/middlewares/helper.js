const Users = require('../users.model');

module.exports.updateChatList = async function(param,msg) {
    await Users.update({"_id" : param.senderId}, {
        $pull : {
            chatList : {
                receiverId : param.receiverId
            }
        }
    });

    await Users.update({"_id" : param.receiverId}, {
        $pull : {
            chatList : {
                receiverId : param.senderId
            }
        }
    });

    await Users.update({"_id" : param.senderId}, {
        $push : {
            chatList : {
                $each : [
                    {
                        receiverId : param.receiverId,
                        msgId : msg._id
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
                        msgId : msg._id
                    }
                ],
                $position : 0
            }
        }
    });
}