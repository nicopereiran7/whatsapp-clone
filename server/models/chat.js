import mongoose from "mongoose";

const ChatSchema = mongoose.Schema({
  message: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
});

export default mongoose.model("chats", ChatSchema);
