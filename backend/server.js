import express from 'express';
import dotenv from "dotenv";
import { connectDB } from './config/db.js';
import userRoutes from './routes/user.route.js'
// import User from './models/user.js';

dotenv.config();

const app = express();

// app.get("/", (req,res) => {
//     res.send("Server is ready");
// });

app.use(express.json()); // allows us to accept JSON data in the req.body

app.use("/api/users", userRoutes);

app.listen(4000, () => {
    connectDB();
    console.log("Server started at http://localhost:4000");
});

//z99z8aQXLFKRZcFX
//vvJUZzvgNJ4wA1dt