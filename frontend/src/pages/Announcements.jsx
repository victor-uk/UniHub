import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { io } from 'socket.io-client';

const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await api.get('/api/announcements');
                setAnnouncements(response.data);
            } catch (err) {
                setError('Failed to fetch announcements.');
            } finally {
                setLoading(false);
            }
        };
        fetchAnnouncements();
    }, []);

    useEffect(() => {
        // Make sure this URL matches your backend server's address
        const socket = io('http://localhost:5000');

        socket.on('connect', () => {
            // DEBUG: This will appear in your BROWSER console on successful connection
            console.log('✅ Connected to Socket.io server!');
        });

        socket.on('new_announcement', (newAnnouncement) => {
            // DEBUG: This will appear in your BROWSER console when a new announcement arrives
            console.log('📩 Received new announcement:', newAnnouncement);
            setAnnouncements((prevAnnouncements) => [newAnnouncement, ...prevAnnouncements]);
        });

        socket.on('updated_announcement', (updatedAnnouncement) => {
            console.log('📝 Received updated announcement:', updatedAnnouncement);
            setAnnouncements((prevAnnouncements) => 
                prevAnnouncements.map(ann => 
                    ann._id === updatedAnnouncement._id ? updatedAnnouncement : ann
                )
            );
        });

        socket.on('deleted_announcement', (deletedAnnouncementId) => {
            console.log('🗑️ Received deleted announcement:', deletedAnnouncementId);
            setAnnouncements((prevAnnouncements) => 
                prevAnnouncements.filter(ann => ann._id !== deletedAnnouncementId)
            );
        });
        
        socket.on('connect_error', (err) => {
            // DEBUG: This will appear in your BROWSER console if connection fails
            console.error('❌ Socket.io connection error:', err);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-8">Announcements</h1>
            <div className="space-y-6 max-w-4xl mx-auto">
                {announcements.length > 0 ? (
                    announcements.map((announcement) => (
                        <div key={announcement._id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
                            <h2 className="text-2xl font-bold mb-2">{announcement.title}</h2>
                            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: announcement.content }} />
                            <p className="text-sm text-gray-500 mt-4">
                                Posted on: {new Date(announcement.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No announcements yet.</p>
                )}
            </div>
        </div>
    );
};

export default Announcements;

