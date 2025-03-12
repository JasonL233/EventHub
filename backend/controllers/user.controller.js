import mongoose from "mongoose";
import User from "../models/user.model.js";

export const updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const { username, profileImage } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid User ID" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(id, { username, profileImage }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Error updating user profile:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.log("error in Fetching users:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// Get user by user id
export const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error in fetching user: ", error.message);

    if (error.name === "CastError")
      return res
        .status(400)
        .json({ success: true, message: "Invalid user ID format" });

    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createUsers = async (req, res) => {
  const user = req.body; // user will send this data

  if (!user.username) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide username" });
  } else if (!user.password) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide password" });
  }
  const existUser = await User.findOne({ username: user.username });
  if (existUser) {
    return res
      .status(400)
      .json({
        success: false,
        message: "user already exists, please login instead",
      });
  }

  const newUser = new User(user);

  try {
    await newUser.save();
    res
      .status(200)
      .json({
        success: true,
        data: newUser,
        message: "Account create successfully!",
      });
  } catch (error) {
    console.error(`Error in Create User: ${error.message}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateUsers = async (req, res) => {
  const { id } = req.params;
  const user = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid User Id" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(id, user, { new: true });
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteUsers = async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    console.log("error in deleting user:", error.message);
    res.status(404).json({ success: false, message: "User not found" });
  }
};

export const userLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide username" });
  } else if (!password) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide password" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      // can't find this username
      return res
        .status(400)
        .json({
          success: false,
          message: "User does not exist, please create an account first",
        });
    }
    if (user.password !== password) {
      return res
        .status(400)
        .json({ success: false, message: "Wrong password, please try again" });
    }

    res.status(200).json({
      success: true,
      message: "Login successfully!",
      user: user,
    });
  } catch (error) {
    console.log("Error in Logging in:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateLikedPost = async (req, res) => {
  const { id } = req.params;
  const { event_id, action } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).json({ success: false, message: "Invalid userID" });

  try {
    let update = {};

    if (action === "liked") update.$addToSet = { likedPosts: event_id };
    else if (action === "unliked") update.$pull = { likedPosts: event_id };
    else
      return res
        .status(404)
        .json({
          success: false,
          message: "No action for storing user's liked events",
        });

    const updatedUser = await User.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Error updating likes:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Handle user follow/unfollow event organizer
export const updateFollow = async (req, res) => {
  const targetId = req.params.id; // Target user ID
  const { user_id, action } = req.body; // current user ID and operation

  if (!mongoose.Types.ObjectId.isValid(targetId) || !mongoose.Types.ObjectId.isValid(user_id)) {
    return res.status(400).json({ success: false, message: "Invalid userID" });
  }

  let updateCurrent, updateTarget;
  if (action === "follow") {

    updateCurrent = { $addToSet: { following: targetId } };
    updateTarget = { $addToSet: { followers: user_id } };

  } else if (action === "unfollow") {

    updateCurrent = { $pull: { following: targetId } };
    updateTarget = { $pull: { followers: user_id } };

  } else {
    
    return res.status(400).json({ success: false, message: "No action" });
  }

  try {
    const [updatedCurrent, updatedTarget] = await Promise.all([
      User.findByIdAndUpdate(user_id, updateCurrent, { new: true }),
      User.findByIdAndUpdate(targetId, updateTarget, { new: true })
    ]);

    if (!updatedCurrent || !updatedTarget) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: { currentUser: updatedCurrent, targetUser: updatedTarget }
    });
  } catch (error) {
    console.error("Error updating follow:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};