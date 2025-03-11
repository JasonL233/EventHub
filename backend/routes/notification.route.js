import express from "express";
import { getNotifications, markNotificationsAsRead } from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/:userId", getNotifications);
router.put("/:userId/read", markNotificationsAsRead);

export default router;
