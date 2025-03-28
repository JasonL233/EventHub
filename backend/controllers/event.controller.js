import mongoose from "mongoose";
import Event from "../models/event.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

// Get single specific event
export const getEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
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

// Get all events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({}).populate("publisherId", "-password");

    res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.log("error in fetching events:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Creating events: support for images and videos
export const createEvent = async (req, res) => {
  try {
    const { title, description, mediaUrl, eventType, publisherId, tags } =
      req.body;

    // Validate required fields
    if (!title || !description || !mediaUrl || !publisherId) {
      return res.status(400).json({
        success: false,
        message: "Please provide title, description, mediaUrl, and publisherId",
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
      mediaUrl,
      eventType: eventType || "image", // Default type is image
      publisherId,
      likes: 0,
      comments: [],
      tags: Array.isArray(tags) ? tags : [], // Ensure tags is an array
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
  const event = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Event Id" });
  }
  try {
    const updatedEvent = await Event.findByIdAndUpdate(id, event, {
      new: true,
    });
    res.status(200).json({ success: true, data: updatedEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deletePost = async (req, res) => {
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
    return res
      .status(400)
      .json({ success: false, message: "Invalid event ID" });
  }
  try {
    let update = { likes: likes };
    if (action === "like") update.$addToSet = { likedBy: user_id };
    else if (action === "unlike") update.$pull = { likedBy: user_id };
    else
      return res
        .status(400)
        .json({ success: false, message: "Invalid action" });

    const updatedEvent = await Event.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
    if (!updatedEvent) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    if (action === "like" && user_id.toString() !== updatedEvent.publisherId.toString()) {
      const likerUser = await User.findById(user_id);
      const likerName = likerUser ? likerUser.username : "Someone";
      await Notification.create({
        recipient: updatedEvent.publisherId,
        type: "like",
        message: `${likerName} liked your post "${updatedEvent.title}."`,
        sender: user_id,
        post: updatedEvent._id,
      });
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
    return res
      .status(400)
      .json({ success: false, message: "Invalid event ID" });
  }
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }
    event.comments.push({ userId: user_id, comment: comment });
    await event.save();

    if (user_id.toString() !== event.publisherId.toString()) {
      const commenterUser = await User.findById(user_id);
      const commenterName = commenterUser ? commenterUser.username : "Someone";

      await Notification.create({
        recipient: event.publisherId,
        type: "comment",
        message: `${commenterName} commented on your post "${event.title}."`,
        sender: user_id,
        post: event._id,
      });
    }

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
    return res
      .status(400)
      .json({ success: false, message: "Invalid event ID" });
  }
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  try {
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    const repliedComment = event.comments.find(c => c._id.toString() === reply_to);
    if (!repliedComment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    const update = { userId: user_id, comment: comment, replyTo: reply_to };
    event.comments.push(update);
    await event.save();

    if (user_id.toString() !== repliedComment.userId.toString()) {
      const replierUser = await User.findById(user_id);
      const replierName = replierUser ? replierUser.username : "Someone";

      await Notification.create({
        recipient: repliedComment.userId,
        type: "reply",
        message: `${replierName} replied to your comment on "${repliedComment.comment}": "${comment}"`,
        sender: user_id,
        post: event._id,
      });
    }

    const updatedEvent = await Event.findById(id);
    if (!updateEvent) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }
    res.status(200).json({ success: true, data: updatedEvent });
  } catch (error) {
    console.error("Error Replying Comment:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get all comments by evet id
export const getComments = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }
    res.status(200).json({ success: true, data: event.comments });
  } catch (error) {
    console.error("Error in fetching comments: ", error.message);

    if (error.name === "CastError")
      return res
        .status(400)
        .json({ success: true, message: "Invalid event ID format" });

    res.status(500).json({ success: false, message: "Server Error" });
  }
};
