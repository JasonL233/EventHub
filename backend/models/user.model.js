import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  profileImage: {
    type : String,
    default: "https://static.thenounproject.com/png/5034901-200.png"
    // https://static1.cbrimages.com/wordpress/wp-content/uploads/2022/05/spy-x-family-anyas-classic-meme-face-heh.jpg?q=50&fit=crop&w=1140&h=&dpr=1.5
    //"https://cdn.kinocheck.com/i/tw5o2a0n6a.jpg"
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
