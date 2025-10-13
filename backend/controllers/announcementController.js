import asyncHandler from 'express-async-handler';
import Announcement from '../models/Announcement.js';
import { getIO } from '../services/socketService.js';

// @desc    Create an announcement
// @route   POST /api/announcements
// @access  Private/Admin
const createAnnouncement = asyncHandler(async (req, res) => {
    const { title, content, department, priority, image } = req.body;

    const announcement = new Announcement({
        title,
        content,
        department,
        priority,
        image, // Save the image URL
        author: req.user._id,
    });

    const createdAnnouncement = await announcement.save();
    
    // Populate author details before sending
    const populatedAnnouncement = await Announcement.findById(createdAnnouncement._id).populate('author', 'name');

    getIO().emit('new_announcement', populatedAnnouncement);
    res.status(201).json(populatedAnnouncement);
});

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Public
const getAnnouncements = asyncHandler(async (req, res) => {
    const announcements = await Announcement.find({}).populate('author', 'name').sort({ createdAt: -1 });
    res.json(announcements);
});

// @desc    Update an announcement
// @route   PUT /api/announcements/:id
// @access  Private/Admin
const updateAnnouncement = asyncHandler(async (req, res) => {
    const { title, content, department, priority, image } = req.body;
    const announcement = await Announcement.findById(req.params.id);

    if (announcement) {
        announcement.title = title || announcement.title;
        announcement.content = content || announcement.content;
        announcement.department = department || announcement.department;
        announcement.priority = priority || announcement.priority;
        announcement.image = image; // Can be updated or removed (set to null)

        const updatedAnnouncement = await announcement.save();
        const populatedAnnouncement = await Announcement.findById(updatedAnnouncement._id).populate('author', 'name');
        
        getIO().emit('announcement_updated', populatedAnnouncement);
        res.json(populatedAnnouncement);
    } else {
        res.status(404);
        throw new Error('Announcement not found');
    }
});

// @desc    Delete an announcement
// @route   DELETE /api/announcements/:id
// @access  Private/Admin
const deleteAnnouncement = asyncHandler(async (req, res) => {
    const announcement = await Announcement.findById(req.params.id);

    if (announcement) {
        await announcement.deleteOne();
        getIO().emit('announcement_deleted', req.params.id);
        res.json({ message: 'Announcement removed' });
    } else {
        res.status(404);
        throw new Error('Announcement not found');
    }
});

export { 
    createAnnouncement, 
    getAnnouncements,
    updateAnnouncement,
    deleteAnnouncement
};

