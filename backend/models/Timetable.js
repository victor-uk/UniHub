import mongoose from 'mongoose';

const timetableSchema = new mongoose.Schema({
    courseCode: {
        type: String,
        required: true,
    },
    courseTitle: {
        type: String,
        required: true,
    },
    day: {
        type: String,
        required: true,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    lecturer: {
        type: String,
        required: true,
    },
    venue: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    // This is the corrected field
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
}, {
    timestamps: true,
});

const Timetable = mongoose.model('Timetable', timetableSchema);

export default Timetable;

