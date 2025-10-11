import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"], // Your frontend URL
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        // DEBUG: This log will appear in your backend terminal when a user opens the page
        console.log('✅ A user connected via Socket.io:', socket.id);

        socket.on('disconnect', () => {
            console.log('❌ User disconnected:', socket.id);
        });
    });
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

// Helper functions for broadcasting announcements
export const broadcastNewAnnouncement = (announcement) => {
    if (io) {
        console.log('📢 Broadcasting new announcement:', announcement.title);
        io.emit('new_announcement', announcement);
    }
};

export const broadcastUpdatedAnnouncement = (announcement) => {
    if (io) {
        console.log('📢 Broadcasting updated announcement:', announcement.title);
        io.emit('updated_announcement', announcement);
    }
};

export const broadcastDeletedAnnouncement = (announcementId) => {
    if (io) {
        console.log('📢 Broadcasting deleted announcement:', announcementId);
        io.emit('deleted_announcement', announcementId);
    }
};

