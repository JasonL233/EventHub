import express from "express";
import { getUsers, createUsers, updateUsers, deleteUsers, userLogin, updateLikedPost } from '../controllers/user.controller.js'

const router = express.Router();

router.get("/", getUsers);
router.post("/", createUsers);
router.patch("/:id", updateUsers);
router.delete("/:id", deleteUsers);
router.post("/login", userLogin);
router.patch("/:id/likedPosts", updateLikedPost);

export default router;