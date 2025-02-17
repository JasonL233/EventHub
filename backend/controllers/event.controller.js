import mongoose from "mongoose";
import Event from "../models/event.model.js";

// Get all events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({});
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.log("ERROR IS HEREEE");
    console.log("error in fetching events:", error.message);
    res.status(500).json({ success: false, message: "Sever Error" });
  }
};

// Get single specific event
export const getEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findById(id);

    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    console.error("Error in fetching event: ", error.message);

    if (error.name === "CastError")
      return res
        .status(400)
        .json({ success: true, message: "Invalid event ID format" });

    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createEvent = async (req, res) => {
  const { title, description, image, publisherId, comments, likes } = req.body;

  // Validate required fields
  if (!title || !description || !image || !publisherId) {
    return res.status(400).json({
      success: false,
      message: "Please provide title, description, image, and publisherId",
    });
  }

  // Validate publisherId as ObjectId
  if (!mongoose.Types.ObjectId.isValid(publisherId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid publisherId format",
    });
  }

  const newEvent = new Event({
    title,
    description,
    image,
    publisherId,
    likes: likes || 0,
    comments: comments || [],
  });

  try {
    await newEvent.save();
    res.status(201).json({ sucess: true, data: newEvent });
  } catch (error) {
    console.error("Error in creating event:", error.message);
    res.status(500).json({ success: false, message: "Sever Error" });
  }
};

export const updateEvent = async (req, res) => {
  const { id } = req.params;

  const event = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ sucess: false, message: "Invalid Event Id" });
  }

  try {
    const updatedEvent = await Event.findByIdAndUpdate(id, event, {
      new: true,
    });
    res.status(200).json({ success: true, data: updatedEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: "Sever Error" });
  }
};

export const deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    await Event.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Event deleted" });
  } catch (error) {
    console.error("Error in deleting event:", error.message);
    res.status(404).json({ success: false, message: "Event not found" });
  }
};

export const likeEvent = async (req, res) => {
  const { id } = req.params;
  const { likes } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res
      .status(400)
      .json({ success: false, message: "Invalid event ID" });

  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {likes},
      { new: true, runValidators: true }
    );

    if (!updateEvent)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });

    res.status(200).json({ success: true, data: updatedEvent });
  } catch (error) {
    console.error("Error updating likes:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
