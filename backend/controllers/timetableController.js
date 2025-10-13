import asyncHandler from 'express-async-handler';
import Timetable from '../models/Timetable.js';
import { getIO } from '../services/socketService.js';

// @desc    Create a new timetable entry
// @route   POST /api/timetables
// @access  Private/Admin
const createTimetableEntry = asyncHandler(async (req, res) => {
    const { day, time, courseCode, courseTitle, venue, level, department } = req.body;

    const timetableEntry = new Timetable({
        day,
        time,
        courseCode,
        courseTitle,
        venue,
        level,
        department
    });

    const createdEntry = await timetableEntry.save();
    
    // Emit event for real-time update
    getIO().emit('new_timetable_entry', createdEntry);

    res.status(201).json(createdEntry);
});

// @desc    Get all timetable entries
// @route   GET /api/timetables
// @access  Public
const getTimetableEntries = asyncHandler(async (req, res) => {
    const entries = await Timetable.find({});
    res.json(entries);
});

// @desc    Update a timetable entry
// @route   PUT /api/timetables/:id
// @access  Private/Admin
const updateTimetableEntry = asyncHandler(async (req, res) => {
    const { day, time, courseCode, courseTitle, venue, level, department } = req.body;
    
    const entry = await Timetable.findById(req.params.id);

    if (entry) {
        entry.day = day || entry.day;
        entry.time = time || entry.time;
        entry.courseCode = courseCode || entry.courseCode;
        entry.courseTitle = courseTitle || entry.courseTitle;
        entry.venue = venue || entry.venue;
        entry.level = level || entry.level;
        entry.department = department || entry.department;

        const updatedEntry = await entry.save();
        
        // Emit event for real-time update
        getIO().emit('timetable_entry_updated', updatedEntry);

        res.json(updatedEntry);
    } else {
        res.status(404);
        throw new Error('Timetable entry not found');
    }
});

// @desc    Delete a timetable entry
// @route   DELETE /api/timetables/:id
// @access  Private/Admin
const deleteTimetableEntry = asyncHandler(async (req, res) => {
    const entry = await Timetable.findById(req.params.id);

    if (entry) {
        const entryId = entry._id;
        await entry.deleteOne();
        
        // Emit event for real-time update
        getIO().emit('timetable_entry_deleted', entryId);

        res.json({ message: 'Timetable entry removed' });
    } else {
        res.status(404);
        throw new Error('Timetable entry not found');
    }
});


export { createTimetableEntry, getTimetableEntries, updateTimetableEntry, deleteTimetableEntry };

