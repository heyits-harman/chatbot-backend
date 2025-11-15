import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  messages: [
    {
      sender: String,
      text: String,
      timeStamp: {type: Date, default: Date.now}
    }
  ]
});

const ChatHistory = new mongoose.model("ChatHistory", chatSchema, "chatHistory");
export default ChatHistory;