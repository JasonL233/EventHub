import express from "express";
import { getUsers, createUsers, updateUsers, deleteUsers, userLogin } from '../controllers/user.controller.js'

const router = express.Router();

router.get("/", getUsers);
router.post("/", createUsers);
router.put("/:id", updateUsers);
router.delete("/:id", deleteUsers);
router.post("/login", userLogin);

export default router;