import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    // This is the new field for the image URL
    image: {
        type: String, 
        required: false, // Not every announcement must have an image
    },
    department: {
        type: String,
        required: true,
        default: 'General',
    },
    priority: {
        type: String,
        enum: ['low', 'normal', 'high', 'urgent'],
        default: 'normal',
    },
}, {
    timestamps: true,
});

const Announcement = mongoose.model('Announcement', announcementSchema);

export default Announcement;

