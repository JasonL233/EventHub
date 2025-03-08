import mongoose from "mongoose";
import dotenv from "dotenv";
import Event from "../models/event.model.js";

dotenv.config();    // Load .env variables 

const migrateImageToMediaURL = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    try {
        const docsToUpdate = await Event.find({ abcc: { $exists: true } });
        console.log(`🔍 Found ${docsToUpdate.length} documents with "abcc" field`);

        const result = await Event.updateMany(
            // abcc MUST exeist in Event schema            
            { abcc: { $exists: true } },
            { $rename: { "abcc": "eventType" } }
        );

        console.log(`Updated ${result.modifiedCount} events!`);
    } catch (error) {
        console.error("Error updating events: ", error);
    } finally {
        mongoose.connection.close();
    }
};

migrateImageToMediaURL();