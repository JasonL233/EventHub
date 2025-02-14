import express from 'express';
import dotenv from "dotenv";
import { connectDB } from './config/db.js';
import userRoutes from './routes/user.route.js';
import eventRoutes from "./routes/event.route.js";
//import User from './models/user.js';
import mongoose, { mongo } from 'mongoose';

dotenv.config();

const app = express();

app.get("/", (req,res) => {
    res.send("Server is ready");
});

app.use(express.json()); // allows us to accept JSON data in the req.body

app.use("/api/users", userRoutes);

app.use("/api/events", eventRoutes);

app.listen(4000, () => {
    connectDB();
    console.log("MONGO_URI:", process.env.MONGO_URI);
});