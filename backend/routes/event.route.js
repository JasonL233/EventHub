import express from "express";
import { createEvent, deletePost, getEvent, getEvents, getComments, updateEvent, likeEvent, addComment, replyComment} from "../controllers/event.controller.js";

// Prefix: /api/events

const router = express.Router();

router.get("/", getEvents);

router.get("/", getEvents);

router.get("/:id", getEvent);

router.post("/", createEvent);

router.get("/:id/comments", getComments);

router.put("/:id", updateEvent);

router.patch("/:id/like", likeEvent);

router.patch("/:id/comment", addComment);

router.patch("/:id/reply", replyComment);

router.delete("/:id", deletePost);

export default router;