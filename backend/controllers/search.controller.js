import mongoose from "mongoose";
import Event from "../models/event.model.js";
import User from "../models/user.model.js"

// Get events that match the title
export const getSearchEventByTitle = async (req, res) => {
    const { searchTitle } = req.params;

  try {
    const events = await Event.find({
        title: {$exists: true, $ne: null, $regex: searchTitle, $options: 'i'}
    }).populate("publisherId", "-password");
      
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
      }).populate("publisherId", "-password");
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
    }).populate("publisherId", "-password");
    console.log("search events: ", events);
    res.status(200).json({ success: true, data: events, message: "Search success"});
  } catch (error) {
    console.error("Error in searching events by tag: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const getSearchEventsByAll = async (req, res) => {
  const {searchQuery} = req.params;

  try {

    // Find events by title
    const titleEvents = await Event.find({
      title: { $regex: searchQuery, $options: 'i' }
    }).populate("publisherId", "-password");

    // Find events by usernames
    const usernames = await User.find({
      username: {$exists: true, $ne: null, $regex: searchQuery, $options: 'i'}
    });

    const publisherIds = usernames.map(user => user._id);
    const usernameEvents = await Event.find({
      publisherId: {$in: publisherIds }
    }).populate("publisherId", "-password");

    // Find events by tag
    const tagEvents = await Event.find({
      tags: { $in: [new RegExp(searchQuery, 'i')] }
    }).populate("publisherId", "-password");

    const eventMap = new Map();

    // Helper function to add events to map
    const addToMap = (events, source) => {
      events.forEach(event => {
        if (!eventMap.has(event._id.toString())) {
          eventMap.set(event._id.toString(), {
            ...event.toObject(),
            matchedBy: [source]
          });
        } else {
          const existing = eventMap.get(event._id.toString());
          if (!existing.matchedBy.includes(source)) {
            existing.matchedBy.push(source);
          }
        }
      });
    };

    addToMap(titleEvents, "title");
    addToMap(usernameEvents, "username");
    addToMap(tagEvents, "tag");

    const uniqueEvents = Array.from(eventMap.values());

    res.status(200).json({
      success: true, 
      data: uniqueEvents,
      message: "Combined search Success"
    });
  } catch (error) {
    console.error("Error in combined searching: ", error.message);
    res.status(500).json({
      success: false, 
      message: "Server error from combined searching"
    });
  }

};

