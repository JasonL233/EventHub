import express from 'express';
import dotenv from "dotenv";
import { connectDB } from './config/db.js';
import User from './models/user.js';

dotenv.config();

const app = express();

app.get("/", (req,res) => {
    res.send("Server is ready");
});

app.use(express.json()); // allows us to accept JSON data in the req.body

app.post("/api/users", async (req, res) => {
    const user = req.body; // user will send this data

    if (!user.username) {
        return res.status(400).json({success:false, message: "Please provide username"});
    } else if (!user.password) {
        return res.status(400).json({success:false, message: "Please provide password"});
    }

    const newUser = new User(user);

    try {
        await newUser.save();
        res.status(201).json({ success: true, data: newUser});
    } catch (error) {
        console.error(`Error in Create User: ${error.message}`);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

app.listen(5000, () => {
    connectDB();
    console.log("HIII");
    console.log("Server started at http://localhost:5000");
});

//z99z8aQXLFKRZcFX