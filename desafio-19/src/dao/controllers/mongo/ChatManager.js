const chatModel = require("../../models/chat.model");

class ChatManager {
    constructor () {
        this.chats = [];
    }

    addMessage = async (user, message) => {
        const newMessage = await chatModel.create({
            user,
            message
        });
        return newMessage
    }


    getMessage = async () => {
        this.chats = await chatModel.find({}).lean();
        return this.chats
    }

}

module.exports = ChatManager;