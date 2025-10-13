import asyncHandler from 'express-async-handler';
import Event from '../models/Event.js';
import { getIO } from '../services/socketService.js';

// @desc    Create an event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = asyncHandler(async (req, res) => {
    const { title, description, startDate, endDate, venue, image } = req.body;

    const event = new Event({
        title,
        description,
        startDate,
        endDate,
        venue,
        image, // Save the image URL
        organizer: req.user._id,
    });

    const createdEvent = await event.save();

    // Populate organizer details before sending
    const populatedEvent = await Event.findById(createdEvent._id).populate('organizer', 'name');
    
    getIO().emit('new_event', populatedEvent);
    res.status(201).json(populatedEvent);
});

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = asyncHandler(async (req, res) => {
    const events = await Event.find({}).populate('organizer', 'name').sort({ startDate: 1 });
    res.json(events);
});

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = asyncHandler(async (req, res) => {
    const { title, description, startDate, endDate, venue, image } = req.body;
    const event = await Event.findById(req.params.id);

    if (event) {
        event.title = title || event.title;
        event.description = description || event.description;
        event.startDate = startDate || event.startDate;
        event.endDate = endDate || event.endDate;
        event.venue = venue || event.venue;
        event.image = image; // Can be updated or removed

        const updatedEvent = await event.save();
        const populatedEvent = await Event.findById(updatedEvent._id).populate('organizer', 'name');

        getIO().emit('event_updated', populatedEvent);
        res.json(populatedEvent);
    } else {
        res.status(404);
        throw new Error('Event not found');
    }
});

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (event) {
        await event.deleteOne();
        getIO().emit('event_deleted', req.params.id);
        res.json({ message: 'Event removed' });
    } else {
        res.status(404);
        throw new Error('Event not found');
    }
});

export { createEvent, getEvents, updateEvent, deleteEvent };

