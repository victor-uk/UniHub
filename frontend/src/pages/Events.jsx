import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Calendar, Tag, MapPin } from 'lucide-react';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.get('/events');
                setEvents(response.data);
            } catch (err) {
                setError('Failed to fetch events.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) return <div className="text-center py-10">Loading events...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">Upcoming Events</h1>
            <div className="space-y-8 max-w-4xl mx-auto">
                {events.length > 0 ? (
                    events.map((event) => (
                        <div key={event._id} className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-yellow-500 hover:shadow-xl transition-shadow duration-300">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h2>
                            <div className="flex items-center text-gray-500 text-sm mb-4">
                                <Calendar size={16} className="mr-2" />
                                <span>{formatDate(event.startDate)}</span>
                                <span className="mx-2">to</span>
                                <span>{formatDate(event.endDate)}</span>
                            </div>
                            <p className="text-gray-700 mb-4">{event.description}</p>
                            <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                                    <MapPin size={14} className="mr-2 text-gray-600" />
                                    <span className="font-medium">{event.venue}</span>
                                </div>
                                <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                                    <Tag size={14} className="mr-2 text-gray-600" />
                                    <span className="font-medium">Organized by: {event.organizer.name}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <h3 className="text-xl text-gray-700">No upcoming events.</h3>
                        <p className="text-gray-500 mt-2">Please check back later!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Events;
