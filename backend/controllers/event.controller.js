import mongoose from "mongoose";
import Event from "../models/event.model.js";

export const getEvents = async (req, res) => {
    try {
        const events = await Event.find({});
        res.status(200).json({success: true, data: events});
    } catch (error) {
        console.log("error in fetching events:", error.message);
        res.status(500).json({success: false, message: "Sever Error"});
    }
};

export const createEvent = async (req, res) => {
    const event = req.body;

    if (!event.name || !event.price) {
        return res.status(400).json({sucess: false, message: "Please provide all fields"});
    }

    const newEvent = new Event(event);

    try {
        await newEvent.save();
        res.status(201).json({sucess: true, data: newEvent});
    } catch (error) {
        console.error("Error in creating event:", error.message);
        res.status(500).json({ success: false, message: "Sever Error"});
    }
};

export const updateEvent = async(req, res) => {
    const {id} = req.params;

    const event = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({sucess: false, message:"Invalid Event Id"});
    }

    try {
        const updatedEvent = await Event.findByIdAndUpdate(id, event, {new:true});
        res.status(200).json({success: true, data: updatedEvent});
    } catch (error) {
        res.status(500).json({success: false, message: "Sever Error"});
    }
};

export const deleteEvent = async (req, res) => {
    const {id} = req.params;
    
    try {
        await Event.findByIdAndDelete(id);
        res.status(200).json({success: true, message: "Event deleted"});
    } catch (error) {
        console.error("Error in deleting event:", error.message);
        res.status(404).json({success: false, message: "Event not found"});
    }
};