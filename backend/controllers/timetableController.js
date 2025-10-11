import Timetable from '../models/Timetable.js';
import asyncHandler from 'express-async-handler';

// @desc    Get all timetable entries
// @route   GET /api/timetables
// @access  Public
export const getTimetables = asyncHandler(async (req, res) => {
    // Advanced filtering can be added here later (e.g., by level, department)
    const timetables = await Timetable.find({}).sort({ dayOfWeek: 1, startTime: 1 });
    res.status(200).json(timetables);
});

// @desc    Create a new timetable entry
// @route   POST /api/timetables
// @access  Private/Admin/Staff
export const createTimetable = asyncHandler(async (req, res) => {
    const { courseCode, courseTitle, dayOfWeek, startTime, endTime, venue, lecturer, department, level } = req.body;

    if (!courseCode || !courseTitle || !dayOfWeek || !startTime || !endTime || !venue || !level) {
        res.status(400);
        throw new Error('Please fill all required fields');
    }

    const timetable = new Timetable({
        courseCode,
        courseTitle,
        dayOfWeek,
        startTime,
        endTime,
        venue,
        lecturer,
        department,
        level,
        createdBy: req.user.id
    });

    const createdTimetable = await timetable.save();
    res.status(201).json(createdTimetable);
});

// @desc    Update a timetable entry
// @route   PUT /api/timetables/:id
// @access  Private/Admin/Staff
export const updateTimetable = asyncHandler(async (req, res) => {
    const timetable = await Timetable.findById(req.params.id);

    if (timetable) {
        timetable.courseCode = req.body.courseCode || timetable.courseCode;
        timetable.courseTitle = req.body.courseTitle || timetable.courseTitle;
        timetable.dayOfWeek = req.body.dayOfWeek || timetable.dayOfWeek;
        timetable.startTime = req.body.startTime || timetable.startTime;
        timetable.endTime = req.body.endTime || timetable.endTime;
        timetable.venue = req.body.venue || timetable.venue;
        timetable.lecturer = req.body.lecturer || timetable.lecturer;
        timetable.department = req.body.department || timetable.department;
        timetable.level = req.body.level || timetable.level;

        const updatedTimetable = await timetable.save();
        res.json(updatedTimetable);
    } else {
        res.status(404);
        throw new Error('Timetable entry not found');
    }
});


// @desc    Delete a timetable entry
// @route   DELETE /api/timetables/:id
// @access  Private/Admin/Staff
export const deleteTimetable = asyncHandler(async (req, res) => {
    const timetable = await Timetable.findById(req.params.id);

    if (timetable) {
        await timetable.deleteOne();
        res.json({ message: 'Timetable entry removed' });
    } else {
        res.status(404);
        throw new Error('Timetable entry not found');
    }
});
