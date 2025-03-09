import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  mediaUrl: {
    type: String,
    required: true,
  },
  eventType: {
    type: String,
    enum: ["image", "video"],
    default: "image",
  },
  publisherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: {
    type: [{type: mongoose.Schema.Types.ObjectId}],
    default: [],
  },
  comments: {
    type: [
      {
        replyTo: {
          type: mongoose.Schema.Types.ObjectId,
          required: false,
          default: null
        },
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
    default: [],
  },
  tags: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Event = mongoose.model("Event", eventSchema, "events");

export default Event;
