import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  type: {
    type: String, enum: ["follow", "like", "comment", "reply"], required: true },
  message: {
    type: String, required: true },
  sender: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event"
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

const Notification = mongoose.model("Notification", notificationSchema, "notifications");
export default Notification;