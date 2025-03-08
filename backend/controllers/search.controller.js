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
export const getSearchEventsByUsername = async (req, res) => {
  const { searchUsername } = req.params;

  try {
    const users = await User.find({
      username: {$exists: true, $ne: null, $regex: searchUsername, $options: 'i'}
    });
    let events = [];

    for (let user of users) {
      let matchedEvents = await Event.find({
        publisherId: user._id
      });
      events.push(...matchedEvents);
    }
      
    res.status(200).json({ success: true, data: events , message: "Search success"});
  } catch (error) {

    console.error("Error in searching events by username: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getSearchEventsByTag = async (req, res) => {
  const {searchTag } = req.params;
  console.log("search API works");
  try {
    const events = await Event.find({
      tags : { $in: [new RegExp(searchTag, 'i')] }
    });
    console.log("search events: ", events);
    res.status(200).json({ success: true, data: events, message: "Search success"});
  } catch (error) {
    console.error("Error in searching events by tag: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

