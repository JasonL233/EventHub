import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.route.js";
import eventRoutes from "./routes/event.route.js";
import searchRoutes from "./routes/search.route.js";
import notificationRoutes from "./routes/notification.route.js";
// import User from './models/user.js';
// import mongoose, { mongo } from "mongoose";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 4000;

// Parse JSON
app.use(express.json());

app.use("/api/users", userRoutes);

app.use("/api/events", eventRoutes);

app.use("/api/search", searchRoutes);

app.use("/api/events", eventRoutes);

app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => {
  res.send("Server is ready");
});

app.listen(PORT, () => {
  connectDB();
  console.log("Server started at http://localhost:" + PORT);
});
