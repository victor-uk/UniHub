import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import api from '../services/api';
import socketIOClient from 'socket.io-client';
import { format, parseISO } from 'date-fns';
import { Trash2, Edit, AlertTriangle, Calendar, Clock, MapPin } from 'lucide-react';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EventForm from '../components/events/EventForm';

const EventCard = ({ event, onEdit, onDelete }) => {
    const { user } = useAuth();
    const canManage = user && (user.role === 'admin' || user.role === 'staff');
    
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform hover:scale-105 duration-300">
            {event.image && (
                <img src={event.image} alt={event.title} className="w-full h-48 object-cover"/>
            )}
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{event.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">{event.description}</p>
                
                <div className="space-y-3 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4 mt-auto">
                     <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>{format(parseISO(event.startDate), 'PPP')}</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>{format(parseISO(event.startDate), 'p')} - {format(parseISO(event.endDate), 'p')}</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <span>{event.venue}</span>
                    </div>
                </div>

                {canManage && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
                        <button onClick={() => onEdit(event)} className="nav-icon-link" title="Edit"><Edit size={18} /></button>
                        <button onClick={() => onDelete(event)} className="nav-icon-link" title="Delete"><Trash2 size={18} /></button>
                    </div>
                )}
            </div>
        </div>
    );
};


const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [eventToEdit, setEventToEdit] = useState(null);
    
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await api.get('/api/events');
                setEvents(data);
            } catch (error) {
                console.error('Failed to fetch events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();

        const socket = socketIOClient(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000');
        
        socket.on('new_event', (newEvent) => {
            setEvents(prev => [newEvent, ...prev].sort((a, b) => new Date(b.startDate) - new Date(a.startDate)));
        });

        socket.on('event_updated', (updatedEvent) => {
            setEvents(prev => prev.map(event => 
                event._id === updatedEvent._id ? updatedEvent : event
            ));
        });

        socket.on('event_deleted', (deletedId) => {
            setEvents(prev => prev.filter(item => item._id !== deletedId));
        });
        
        return () => socket.disconnect();
    }, []);

    const handleDeleteClick = (event) => {
        setEventToDelete(event);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!eventToDelete) return;
        try {
            await api.delete(`/api/events/${eventToDelete._id}`);
        } catch (error) {
            console.error('Failed to delete event:', error);
        } finally {
            setIsDeleteModalOpen(false);
            setEventToDelete(null);
        }
    };
    
    const handleEditClick = (event) => {
        setEventToEdit(event);
        setIsEditModalOpen(true);
    };
    
    const handleFormSubmit = () => {
        setIsEditModalOpen(false);
        setEventToEdit(null);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">Upcoming Events</h1>
            
            {events.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <p className="text-gray-500 dark:text-gray-400">No upcoming events at the moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {events.map(event => (
                        <EventCard key={event._id} event={event} onEdit={handleEditClick} onDelete={handleDeleteClick} />
                    ))}
                </div>
            )}
            
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Event">
                <EventForm eventToEdit={eventToEdit} onFormSubmit={handleFormSubmit} onCancel={() => setIsEditModalOpen(false)} />
            </Modal>
            
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
                 <div className="text-center">
                    <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">Are you sure?</h3>
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">This will permanently delete the event: <strong className="text-gray-800 dark:text-gray-200">{eventToDelete?.title}</strong>.</p>
                    <div className="mt-6 flex justify-center gap-4">
                        <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="btn-secondary">Cancel</button>
                        <button type="button" onClick={confirmDelete} className="btn-danger">Delete</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Events;

