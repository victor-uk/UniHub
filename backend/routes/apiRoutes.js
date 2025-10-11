import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';

// Import all the controllers
import { 
    createAnnouncement, 
    getAnnouncements,
    getAnnouncementById,
    updateAnnouncement,
    deleteAnnouncement
} from '../controllers/announcementController.js';

import {
    createEvent,
    getEvents
} from '../controllers/eventController.js';

import {
    createTimetable,
    getTimetables,
    updateTimetable,
    deleteTimetable
} from '../controllers/timetableController.js';


const router = express.Router();

// Announcement Routes
router.route('/announcements')
    .post(protect, admin, createAnnouncement)
    .get(getAnnouncements);

router.route('/announcements/:id')
    .get(getAnnouncementById)
    .put(protect, admin, updateAnnouncement)
    .delete(protect, admin, deleteAnnouncement);

// Event Routes (These are the new routes)
router.route('/events')
    .post(protect, admin, createEvent)
    .get(getEvents);

router.route('/events/:id')


// Timetable Routes (These are the new routes)
router.route('/timetables')
    .post(protect, admin, createTimetable)
    .get(getTimetables);

router.route('/timetables/:id')
    .put(protect, admin, updateTimetable)
    .delete(protect, admin, deleteTimetable);


export default router;

