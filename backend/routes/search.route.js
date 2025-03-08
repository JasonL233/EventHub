import express from "express";
import { getSearchEventByTitle, getSearchEventsByTag, getSearchEventsByUsername} from "../controllers/search.controller.js";

// Prefix: /api/search/

const router = express.Router();

router.get("/events/:searchTitle", getSearchEventByTitle);
router.get("/users/:searchUsername", getSearchEventsByUsername);
router.get("/tag/:searchTag", getSearchEventsByTag);

export default router;