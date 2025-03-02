import express from "express";
import { getSearchEventByTitle, getSearchUserByUsername} from "../controllers/search.controller.js";

// Prefix: /api/search/

const router = express.Router();

router.get("/events/:searchTitle", getSearchEventByTitle);
router.get("/users/:searchUsername", getSearchUserByUsername);

export default router;