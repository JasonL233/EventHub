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
    ref: "user",
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
          // If comment post, null. If reply comment, ObjectId of that comment
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
        createdAt: {
          type: Date,
          default: Date.now,
        }
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
