import mongoose from 'mongoose';

const TimetableSchema = new mongoose.Schema({
    courseCode: {
        type: String,
        required: [true, 'Please add a course code'],
        trim: true,
        uppercase: true,
    },
    courseTitle: {
        type: String,
        required: [true, 'Please add a course title'],
        trim: true,
    },
    dayOfWeek: {
        type: String,
        required: [true, 'Please specify the day of the week'],
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    startTime: {
        type: String, // e.g., "09:00"
        required: [true, 'Please add a start time'],
    },
    endTime: {
        type: String, // e.g., "11:00"
        required: [true, 'Please add an end time'],
    },
    venue: {
        type: String,
        required: [true, 'Please add a venue'],
        trim: true,
    },
    lecturer: {
        type: String,
        trim: true,
    },
    department: {
        type: String,
        required: true,
        default: 'General'
    },
    level: {
        type: Number, // e.g., 100, 200, 300, 400
        required: [true, 'Please specify the level'],
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const Timetable = mongoose.model('Timetable', TimetableSchema);

export default Timetable;
