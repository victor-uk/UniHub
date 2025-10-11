import React from 'react';
import AnnouncementForm from '../components/announcements/AnnouncementForm';
import EventForm from '../components/events/EventForm'; // Import the new EventForm
import useAuth from '../hooks/useAuth';

const AdminDashboard = () => {
    const { user } = useAuth();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-lg text-gray-600 mb-8">Welcome, {user?.name}. Manage announcements and events here.</p>

            {/* A simple layout to display both forms */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <AnnouncementForm />
                </div>
                <div>
                    {/* The new event form is now included here */}
                    <EventForm />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

