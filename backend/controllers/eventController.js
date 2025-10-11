import Event from '../models/Event.js';
import asyncHandler from 'express-async-handler';
import { getIO } from '../services/socketService.js';

// @desc    Create a new event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = asyncHandler(async (req, res) => {
    // Organizer is no longer taken from the request body
    const { title, description, startDate, endDate, venue } = req.body;

    if (!title || !description || !startDate || !endDate || !venue) {
        res.status(400);
        throw new Error('Please provide all required event fields.');
    }

    const event = new Event({
        title,
        description,
        startDate,
        endDate,
        venue,
        user: req.user._id,
        organizer: req.user._id, // Automatically set the organizer to the logged-in user
    });

    const createdEvent = await event.save();

    // Populate the organizer field with the user's name before sending back the response
    const populatedEvent = await Event.findById(createdEvent._id).populate('organizer', 'name');

    // Emit the real-time event with the populated organizer name
    getIO().emit('new_event', populatedEvent);

    res.status(201).json(populatedEvent);
});

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = asyncHandler(async (req, res) => {
    // Populate the organizer's name in the response so the frontend can display it
    const events = await Event.find({}).populate('organizer', 'name').sort({ startDate: 1 });
    res.json(events);
});

export {
    createEvent,
    getEvents,
};

