import mongoose from "mongoose";

const MessageSchema = mongoose.Schema({
  body: String,
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model("messages", MessageSchema);
