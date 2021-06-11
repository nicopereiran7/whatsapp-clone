import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: String,
});

export default mongoose.model("users", UserSchema);
