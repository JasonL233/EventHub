import mongoose from "mongoose";
import Event from "../models/event.model.js";

// Get all events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({});
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.log("error in fetching events:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get single specific event
export const getEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
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

// Creating events: support for images and videos
export const createEvent = async (req, res) => {
  try {
    const { title, description, eventType, publisherId, tags } = req.body;

    // Validate required fields
    if (!title || !description || !publisherId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (title, description, publisherId)",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(publisherId)) {
      return res.status(400).json({ success: false, message: "Invalid publisherId format" });
    }

    // Check file
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please upload a file" });
    }

    const mediaUrl = `http://localhost:4000/uploads/${req.file.filename}`;

    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = JSON.parse(tags);
      } catch (err) {
        parsedTags = [];
      }
    }

    const newEvent = new Event({
      title,
      description,
      mediaUrl,
      eventType: eventType || "image",
      publisherId,
      likes: 0,
      comments: [],
      tags: parsedTags,
    });

    await newEvent.save();
    return res.status(201).json({
      success: true,
      data: newEvent,
      message: "Event created successfully",
    });
  } catch (error) {
    console.error("Error in creating event:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateEvent = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid Event Id" });
  }
  try {
    const event = req.body;
    const updatedEvent = await Event.findByIdAndUpdate(id, event, { new: true });
    res.status(200).json({ success: true, data: updatedEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
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
  const { user_id, action, likes } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid event ID" });
  }
  try {
    const update = { likes };
    if (action === "like") update.$addToSet = { likedBy: user_id };
    else if (action === "unlike") update.$pull = { likedBy: user_id };
    else return res.status(400).json({ success: false, message: "Invalid action" });

    const updatedEvent = await Event.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    if (!updatedEvent) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    res.status(200).json({ success: true, data: updatedEvent });
  } catch (error) {
    console.error("Error updating likes:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }

};


// Adding comment
export const addComment = async (req, res) => {
  const { id } = req.params;
  const { user_id, comment } = req.body;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid event ID" });
  }
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    event.comments.push({ userId: user_id, comment: comment });
    await event.save();

    const updatedEvent = await Event.findById(id);
    res.status(200).json({ success: true, data: updatedEvent });
  } catch (error) {
    console.error("Error Adding Comment:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// Reply comment
export const replyComment = async (req, res) => {
  const { id } = req.params;
  const { user_id, comment, reply_to } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid event ID" });
  }
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    event.comments.push({ replyTo: reply_to, userId: user_id, comment: comment });
    await event.save();

    const updatedEvent = await Event.findById(id);
    res.status(200).json({ success: true, data: updatedEvent });
  } catch (error) {
    console.error("Error Replying Comment:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};