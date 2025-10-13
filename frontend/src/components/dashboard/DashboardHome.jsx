import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import StatCard from './StatCard';
import RecentItemCard from './RecentItemCard';
import { FileText, Calendar, Clock, ArrowRight } from 'lucide-react';
import LoadingSpinner from '../ui/LoadingSpinner';

const DashboardHome = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ announcements: 0, events: 0, timetableEntries: 0 });
    const [recentAnnouncements, setRecentAnnouncements] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [announcementsRes, eventsRes, timetableRes] = await Promise.all([
                    api.get('/api/announcements'),
                    api.get('/api/events'),
                    api.get('/api/timetables')
                ]);

                setStats({
                    announcements: announcementsRes.data.length,
                    events: eventsRes.data.length,
                    timetableEntries: timetableRes.data.length,
                });

                setRecentAnnouncements(announcementsRes.data.slice(0, 3));
                setUpcomingEvents(eventsRes.data.slice(0, 3));

            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const canManage = user && (user.role === 'admin' || user.role === 'staff');

    if (loading) {
        return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Welcome, {user.name}!</h1>
                <p className="mt-1 text-gray-600 dark:text-gray-400">Here's a quick overview of what's happening in the department.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard icon={<FileText size={24} />} title="Announcements" value={stats.announcements} />
                <StatCard icon={<Calendar size={24} />} title="Upcoming Events" value={stats.events} />
                <StatCard icon={<Clock size={24} />} title="Timetable Entries" value={stats.timetableEntries} />
            </div>

            {/* Quick Actions for Admins */}
            {canManage && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Quick Actions</h2>
                    <div className="flex flex-wrap gap-4">
                        <Link to="/admin" className="btn-primary">Go to Dashboard</Link>
                    </div>
                </div>
            )}

            {/* Recent Items */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Announcements */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Recent Announcements</h2>
                    <div className="space-y-4">
                        {recentAnnouncements.length > 0 ? (
                            recentAnnouncements.map(item => <RecentItemCard key={item._id} item={item} type="announcement" />)
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">No recent announcements.</p>
                        )}
                    </div>
                    <Link to="/announcements" className="text-blue-500 dark:text-blue-400 hover:underline mt-4 inline-flex items-center gap-1">
                        View All <ArrowRight size={16} />
                    </Link>
                </div>

                {/* Upcoming Events */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Upcoming Events</h2>
                    <div className="space-y-4">
                        {upcomingEvents.length > 0 ? (
                            upcomingEvents.map(item => <RecentItemCard key={item._id} item={item} type="event" />)
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">No upcoming events.</p>
                        )}
                    </div>
                    <Link to="/events" className="text-blue-500 dark:text-blue-400 hover:underline mt-4 inline-flex items-center gap-1">
                        View All <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;

