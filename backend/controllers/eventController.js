import Event from '../models/Event.js';

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res, next) => {
    try {
        const events = await Event.find().populate('organizer', 'name').sort({ startDate: 1 });
        res.status(200).json(events);
    } catch (error) {
        next(error);
    }
};

// @desc    Create an event
// @route   POST /api/events
// @access  Private/Admin or Staff
export const createEvent = async (req, res, next) => {
    try {
        const { title, description, startDate, endDate, venue } = req.body;

        if (!title || !description || !startDate || !endDate || !venue) {
            res.status(400);
            throw new Error('Please provide all required event fields');
        }

        const event = new Event({
            title,
            description,
            startDate,
            endDate,
            venue,
            organizer: req.user.id,
        });

        const createdEvent = await event.save();
        res.status(201).json(createdEvent);
    } catch (error) {
        next(error);
    }
};

// Add updateEvent and deleteEvent functions later as needed
