import mongoose from "mongoose";
import Event from "../models/event.model.js";

// Get events that match the title
export const getSearchEventByTitle = async (req, res) => {
    const { searchTitle } = req.params;

  try {
    const events = await Event.find({
        title: {$exists: true, $ne: null, $regex: searchTitle, $options: 'i'}
    });

    if (events.length === 0)
      

    res.status(200).json({ success: true, data: events , message: "Search success"});
  } catch (error) {

    console.error("Error in search event by title: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
