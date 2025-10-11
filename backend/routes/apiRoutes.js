import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { 
    createAnnouncement, 
    getAnnouncements,
    getAnnouncementById,
    updateAnnouncement,
    deleteAnnouncement 
} from '../controllers/announcementController.js';

const router = express.Router();

// Announcement Routes
router.route('/announcements')
    .post(protect, authorize('admin', 'staff', 'student'), createAnnouncement)
    .get(getAnnouncements);

router.route('/announcements/:id')
    .get(getAnnouncementById)
    .put(protect, authorize('admin', 'staff'), updateAnnouncement)
    .delete(protect, authorize('admin', 'staff'), deleteAnnouncement);

export default router;
