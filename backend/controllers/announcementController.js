import Announcement from '../models/Announcement.js';
import { broadcastNewAnnouncement, broadcastUpdatedAnnouncement, broadcastDeletedAnnouncement } from '../services/socketService.js';

// @desc    Create an announcement
// @route   POST /api/announcements
// @access  Private/Admin/Staff
export const createAnnouncement = async (req, res) => {
  const { title, content, department, priority } = req.body;

  try {
    const announcement = new Announcement({
      title,
      content,
      department,
      priority,
      author: req.user.id, // from protect middleware
    });

    const createdAnnouncement = await announcement.save();
    
    // Populate the author field for broadcasting
    await createdAnnouncement.populate('author', 'name');
    
    // Broadcast the new announcement to all connected clients
    broadcastNewAnnouncement(createdAnnouncement);
    
    res.status(201).json(createdAnnouncement);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not create announcement', error: error.message });
  }
};

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Public
export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({}).populate('author', 'name').sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not fetch announcements' });
  }
};

// @desc    Get single announcement by ID
// @route   GET /api/announcements/:id
// @access  Public
export const getAnnouncementById = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id).populate('author', 'name');
        if (announcement) {
            res.json(announcement);
        } else {
            res.status(404).json({ message: 'Announcement not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Could not fetch announcement' });
    }
};


// @desc    Update an announcement
// @route   PUT /api/announcements/:id
// @access  Private/Admin/Staff
export const updateAnnouncement = async (req, res) => {
    const { title, content, department, priority } = req.body;
    try {
        const announcement = await Announcement.findById(req.params.id);

        if (announcement) {
            // Optional: Check if the user is the author or an admin
            if (announcement.author.toString() !== req.user.id && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'User not authorized to update this announcement' });
            }

            announcement.title = title || announcement.title;
            announcement.content = content || announcement.content;
            announcement.department = department || announcement.department;
            announcement.priority = priority || announcement.priority;
            
            const updatedAnnouncement = await announcement.save();
            
            // Populate the author field for broadcasting
            await updatedAnnouncement.populate('author', 'name');
            
            // Broadcast the updated announcement to all connected clients
            broadcastUpdatedAnnouncement(updatedAnnouncement);
            
            res.json(updatedAnnouncement);
        } else {
            res.status(404).json({ message: 'Announcement not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Could not update announcement' });
    }
};

// @desc    Delete an announcement
// @route   DELETE /api/announcements/:id
// @access  Private/Admin/Staff
export const deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);

        if (announcement) {
             if (announcement.author.toString() !== req.user.id && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'User not authorized to delete this announcement' });
            }
            // Broadcast the deleted announcement ID before deleting
            broadcastDeletedAnnouncement(announcement._id);
            
            await announcement.deleteOne();
            res.json({ message: 'Announcement removed' });
        } else {
            res.status(404).json({ message: 'Announcement not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Could not delete announcement' });
    }
};
