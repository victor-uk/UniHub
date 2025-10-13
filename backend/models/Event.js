import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    venue: {
        type: String,
        required: true,
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    // This is the new field for the image URL
    image: {
        type: String, 
        required: false, // Not every event must have an image
    },
}, {
    timestamps: true,
});

const Event = mongoose.model('Event', eventSchema);

export default Event;

