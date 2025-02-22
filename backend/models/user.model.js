import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isEventOrganizer: {
    type: Boolean,
    required: true,
  },
  likedPosts: {
    type: [{type: mongoose.Schema.Types.ObjectId}],
    default: [],
  },
});

const User = mongoose.model("User", userSchema);

export default User;
