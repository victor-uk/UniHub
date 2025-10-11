import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import api from '../services/api';
import { format } from 'date-fns';
import io from 'socket.io-client'; // Import socket.io-client

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await api.get('/api/events');
                setEvents(data);
            } catch (err) {
                setError('Failed to fetch events.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();

        // --- Real-time logic ---
        // Use environment variable for the backend URL
        const socket = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000');
        
        socket.on('connect', () => {
            console.log('Connected to Socket.io server for events!');
        });

        socket.on('new_event', (newEvent) => {
            console.log('Received new event:', newEvent);
            // Add the new event to the list, maintaining the sort order by start date
            setEvents(prevEvents => 
                [...prevEvents, newEvent].sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
            );
        });

        // Cleanup on component unmount
        return () => {
            socket.disconnect();
        };
        // --- End of real-time logic ---

    }, []);

    if (loading) return <div className="text-center mt-8">Loading events...</div>;
    if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Upcoming Events</h1>
            {events.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
                    No upcoming events at the moment. Please check back later.
                </div>
            ) : (
                <div className="space-y-6">
                    {events.map(event => (
                        <div key={event._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <h2 className="text-2xl font-semibold text-blue-700 mb-2">{event.title}</h2>
                            <p className="text-gray-600 mb-4">{event.description}</p>
                            <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-6 gap-y-2">
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    <span>{format(new Date(event.startDate), 'PPP')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={16} />
                                    <span>{format(new Date(event.startDate), 'p')} - {format(new Date(event.endDate), 'p')}</span>
                                </div>
                                <div className="font-semibold">{event.venue}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Events;

