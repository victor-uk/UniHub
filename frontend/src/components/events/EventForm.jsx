import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import { AlertTriangle } from 'lucide-react';

const EventForm = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const onSubmit = async (data) => {
        setIsLoading(true);
        setError(null);
        try {
            await api.post('/api/events', data);
            reset();
            // Optionally, you can add a success message here
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create event. Please try again.');
            console.error('Failed to create event:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Create New Event</h3>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold mr-2"><AlertTriangle size={20} className="inline-block" /></strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Event Title</label>
                <input
                    id="title"
                    type="text"
                    {...register('title', { required: 'Title is required' })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    id="description"
                    rows="4"
                    {...register('description', { required: 'Description is required' })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                ></textarea>
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>

            {/* The Organizer input field has been removed as it's now handled automatically on the backend */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date & Time</label>
                    <input
                        id="startDate"
                        type="datetime-local"
                        {...register('startDate', { required: 'Start date is required' })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate.message}</p>}
                </div>
                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date & Time</label>
                    <input
                        id="endDate"
                        type="datetime-local"
                        {...register('endDate', { required: 'End date is required' })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate.message}</p>}
                </div>
            </div>

            <div>
                <label htmlFor="venue" className="block text-sm font-medium text-gray-700">Venue</label>
                <input
                    id="venue"
                    type="text"
                    {...register('venue', { required: 'Venue is required' })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.venue && <p className="text-red-500 text-xs mt-1">{errors.venue.message}</p>}
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
                {isLoading ? 'Publishing...' : 'Publish Event'}
            </button>
        </form>
    );
};

export default EventForm;

