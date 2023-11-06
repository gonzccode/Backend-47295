const mongoose = require("mongoose");

const messagesCollection = "Messages";

const messagesSchema = new mongoose.Schema({
   user:{
       type: String,
       required: true
   },
   message:{
       type: String,
       default: "",
   }
})

const chatModel = mongoose.model(messagesCollection, messagesSchema);

module.exports = chatModel;