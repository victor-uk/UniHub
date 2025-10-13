import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

// Import all the controllers
import { 
    createAnnouncement, 
    getAnnouncements,
    updateAnnouncement,
    deleteAnnouncement
} from '../controllers/announcementController.js';

import {
    createEvent,
    getEvents,
    updateEvent,
    deleteEvent
} from '../controllers/eventController.js';

import {
    createTimetableEntry,
    getTimetableEntries,
    updateTimetableEntry,
    deleteTimetableEntry
} from '../controllers/timetableController.js';


const router = express.Router();

// Upload Route
// When a file is sent to this route, multer processes it and sends it to Cloudinary
router.post('/upload', protect, admin, upload.single('image'), (req, res) => {
    // The middleware will handle the upload and Cloudinary will return a URL
    // We send back the secure URL of the uploaded image
    res.send({
        message: 'Image uploaded successfully',
        image: req.file.path
    });
});


// Announcement Routes
router.route('/announcements')
    .post(protect, admin, createAnnouncement)
    .get(getAnnouncements);

router.route('/announcements/:id')
    .put(protect, admin, updateAnnouncement)
    .delete(protect, admin, deleteAnnouncement);

// Event Routes
router.route('/events')
    .post(protect, admin, createEvent)
    .get(getEvents);

router.route('/events/:id')
    .put(protect, admin, updateEvent)
    .delete(protect, admin, deleteEvent);

// Timetable Routes
router.route('/timetables')
    .post(protect, admin, createTimetableEntry)
    .get(getTimetableEntries);

router.route('/timetables/:id')
    .put(protect, admin, updateTimetableEntry)
    .delete(protect, admin, deleteTimetableEntry);


export default router;

