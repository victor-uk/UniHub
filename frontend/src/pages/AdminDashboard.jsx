import React, { useState } from 'react';
import AnnouncementForm from '../components/announcements/AnnouncementForm';
import EventForm from '../components/events/EventForm';
import TimetableForm from '../components/timetable/TimetableForm';
import { Newspaper, Calendar, ListChecks } from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('announcements');

    const renderContent = () => {
        switch (activeTab) {
            case 'announcements':
                return <AnnouncementForm />;
            case 'events':
                return <EventForm />;
            case 'timetable':
                return <TimetableForm />;
            default:
                return <AnnouncementForm />;
        }
    };

    const TabButton = ({ name, icon, label }) => (
        <button
            onClick={() => setActiveTab(name)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === name
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-200'
            }`}
        >
            {icon}
            {label}
        </button>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-6 text-center">Admin Dashboard</h1>

            <div className="bg-white p-4 rounded-lg shadow-md mb-8">
                <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-4">
                   <TabButton name="announcements" icon={<Newspaper size={18} />} label="Announcements" />
                   <TabButton name="events" icon={<Calendar size={18} />} label="Events" />
                   <TabButton name="timetable" icon={<ListChecks size={18} />} label="Timetable" />
                </div>
                <div className="pt-6">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

