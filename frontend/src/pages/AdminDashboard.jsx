import React, { useState } from 'react';
import AnnouncementForm from '../components/announcements/AnnouncementForm';
import EventForm from '../components/events/EventForm';
import TimetableForm from '../components/timetable/TimetableForm';
import { FileText, Calendar, Clock } from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('announcements');

    const tabs = [
        { id: 'announcements', label: 'Announcements', icon: <FileText size={18} /> },
        { id: 'events', label: 'Events', icon: <Calendar size={18} /> },
        { id: 'timetable', label: 'Timetable', icon: <Clock size={18} /> },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">Admin Dashboard</h1>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="-mb-px flex space-x-4 px-4" aria-label="Tabs">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`${
                                    activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="p-4 sm:p-6">
                    {activeTab === 'announcements' && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Create New Announcement</h2>
                            <AnnouncementForm onFormSubmit={() => {}} onCancel={() => {}} />
                        </div>
                    )}
                    {activeTab === 'events' && (
                         <div>
                            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Create New Event</h2>
                            <EventForm onFormSubmit={() => {}} onCancel={() => {}} />
                        </div>
                    )}
                    {activeTab === 'timetable' && (
                         <div>
                            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Add Timetable Entry</h2>
                           <TimetableForm onFormSubmit={() => {}} onCancel={() => {}} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

