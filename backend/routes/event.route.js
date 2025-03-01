import express from "express";
import { createEvent, deleteEvent, getEvent, getEvents, updateEvent, likeEvent} from "../controllers/event.controller.js";

// Prefix: /api/events

const router = express.Router();

router.get("/", getEvents);

router.get("/:id", getEvent);

router.post("/", createEvent);

router.put("/:id", updateEvent);

router.delete("/:id", deleteEvent);

router.patch("/:id/like", likeEvent);

// router.post("/:id/comment", commentEvent);

export default router;