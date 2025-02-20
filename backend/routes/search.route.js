import express from "express";
import { getSearchEventByTitle} from "../controllers/search.controller.js";

// Prefix: /api/search/

const router = express.Router();

router.get("/events/:searchTitle", getSearchEventByTitle);

export default router;