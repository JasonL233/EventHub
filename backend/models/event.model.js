import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    image:{
        type: String,
        required: false
    },
}, {
    timestamps: true
});

const Event = mongoose.model('Event', eventSchema);

export default Event;