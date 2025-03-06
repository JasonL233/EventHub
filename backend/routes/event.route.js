import express from "express";
import { createEvent, deleteEvent, getEvent, getEvents, updateEvent, likeEvent, addComment, replyComment} from "../controllers/event.controller.js";

// Prefix: /api/events

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder to store uploaded files
  },
  filename: (req, file, cb) => {
    // e.g. "image-1679999999999.jpg"
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// POST with file upload
router.post("/", upload.single("image"), createEvent);

router.get("/", getEvents);
router.get("/:id", getEvent);
router.put("/:id", updateEvent);

router.delete("/:id", deleteEvent);

router.patch("/:id/like", likeEvent);

router.patch("/:id/comment", addComment);

router.patch("/:id/reply", replyComment);

export default router;