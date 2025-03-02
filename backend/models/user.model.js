import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  profileImage: {
    type : String,
    default: "https://cdn.kinocheck.com/i/tw5o2a0n6a.jpg"
  },
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
  following: {
    type: [{type: mongoose.Schema.Types.ObjectId, ref: "User" }],   // Event organizer of interest
    default: [],
  },
  followers: {
    type: [{type: mongoose.Schema.Types.ObjectId, ref: "User" }],  // Users who follow this organizer
    default: [],
  },
});

const User = mongoose.model("User", userSchema);

export default User;
