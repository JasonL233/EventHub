import mongoose from "mongoose";
import Event from "../models/event.model.js";
import User from "../models/user.model.js"

// Get events that match the title
export const getSearchEventByTitle = async (req, res) => {
    const { searchTitle } = req.params;

  try {
    const events = await Event.find({
        title: {$exists: true, $ne: null, $regex: searchTitle, $options: 'i'}
    });
      
    res.status(200).json({ success: true, data: events , message: "Search success"});
  } catch (error) {

    console.error("Error in search event by title: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get users that match the username
export const getSearchUserByUsername = async (req, res) => {
  const { searchUsername } = req.params;

try {
  const users = await User.find({
      username: {$exists: true, $ne: null, $regex: searchUsername, $options: 'i'}
  });
    
  res.status(200).json({ success: true, data: users , message: "Search success"});
} catch (error) {

  console.error("Error in searching users: ", error.message);
  res.status(500).json({ success: false, message: "Server Error" });
}
};

