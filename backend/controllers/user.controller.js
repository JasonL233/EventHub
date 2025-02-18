import mongoose from 'mongoose';
import User from '../models/user.model.js'

export const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.log("error in Fetching users:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const createUsers = async (req, res) => {
    const user = req.body; // user will send this data

    if (!user.username) {
        return res.status(400).json({success:false, message: "Please provide username"});
    } else if (!user.password) {
        return res.status(400).json({success:false, message: "Please provide password"});
    }
    const existUser = await User.findOne(user)
    if (existUser)
    {
        return res.status(400).json({success: false, message: "user already exists, please login instead"});
    }

    const newUser = new User(user);

    try {
        await newUser.save();
        res.status(201).json({ success: true, data: newUser, message: "Account create successfully!"});
    } catch (error) {
        console.error(`Error in Create User: ${error.message}`);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const updateUsers = async (req, res) => {
    const {id} = req.params;
    const user = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid User Id" });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(id, user, {new:true});
        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

export const deleteUsers = async (req, res) => {
    const {id} = req.params;
    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "User deleted" });
    } catch (error) {
        console.log("error in deleting user:", error.message);
        res.status(404).json({ success: false, message: "User not found" });
    }
}

export const userLogin = async (req, res) => {
    const {username, password, isEventOrganizer} = req.body;
    
    if (!username) {
        return res.status(400).json({success:false, message: "Please provide username"});
    } else if (!password) {
        return res.status(400).json({success:false, message: "Please provide password"});
    }

    try {
        const user = await User.findOne({username});
        if (!user) // can't find this username
        {
            return res.status(400).json({success: false, message: "User does not exist, please create an account first"});
        }
        if (user.password !== password)
        {
            return res.status(400).json({success: false, message: "Wrong password, please try again"});
        }
        if (user.isEventOrganizer !== isEventOrganizer)
        {
            return res.status(400).json({success: false, message: "Wrong role, please try again"});
        }

        res.status(200).json({
            success: true, 
            message: "Login successfully!",
            user: user
        });      
    }
    catch (error)
    {
        console.log("Error in Logging in:", error.message );
        return res.status(500).json({success: false, message: "Server Error"});
    }
}