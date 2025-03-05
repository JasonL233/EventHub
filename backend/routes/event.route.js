import express from "express";
import { createEvent, deleteEvent, getEvent, getEvents, updateEvent, likeEvent, addComment, replyComment} from "../controllers/event.controller.js";

// Prefix: /api/events

const router = express.Router();

router.get("/", getEvents);

router.get("/:id", getEvent);

router.post("/", createEvent);

router.put("/:id", updateEvent);

router.delete("/:id", deleteEvent);

router.patch("/:id/like", likeEvent);

router.patch("/:id/comment", addComment);

router.patch("/:id/reply", replyComment);

export default router;