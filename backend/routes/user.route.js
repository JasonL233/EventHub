import express from "express";
import { updateUserProfile, getUsers, getUser, createUsers, updateUsers, deleteUsers, userLogin, updateLikedPost, updateFollow } from '../controllers/user.controller.js'

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/", createUsers);
router.patch("/:id", updateUsers);
router.post("/login", userLogin);
router.patch("/:id/likedPosts", updateLikedPost);
router.patch("/:id/follow", updateFollow);
router.patch("/:id/profile", updateUserProfile);

export default router;