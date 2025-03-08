import express from "express";
import { updateUserProfile, getUsers, getUser, createUsers, updateUsers, deleteUsers, userLogin, updateLikedPost, updateFollowing, updateFollowers } from '../controllers/user.controller.js'

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/", createUsers);
router.patch("/:id", updateUsers);
router.delete("/:id", deleteUsers);
router.post("/login", userLogin);
router.patch("/:id/likedPosts", updateLikedPost);
router.patch("/:id/following", updateFollowing);
router.patch("/:id/followers", updateFollowers);
router.patch("/:id/profile", updateUserProfile);

export default router;