import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../services/api';

const EventForm = ({ onEventCreated }) => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
    const [serverError, setServerError] = useState('');

    const onSubmit = async (data) => {
        setServerError('');
        try {
            const response = await api.post('/events', data);
            // Optionally, call a function passed via props to update the UI
            if (onEventCreated) {
                onEventCreated(response.data);
            }
            reset();
        } catch (error) {
            const message = error.response?.data?.message || "Failed to create event. Please try again.";
            setServerError(message);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-8">
            <h2 className="text-2xl font-bold mb-4">Create New Event</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                {serverError && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{serverError}</p>}

                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Event Title</label>
                    <input
                        id="title"
                        type="text"
                        {...register('title', { required: 'Title is required' })}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                </div>

                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        id="description"
                        rows="4"
                        {...register('description', { required: 'Description is required' })}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date & Time</label>
                        <input
                            id="startDate"
                            type="datetime-local"
                            {...register('startDate', { required: 'Start date is required' })}
                            className={`mt-1 block w-full px-3 py-2 border ${errors.startDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date & Time</label>
                        <input
                            id="endDate"
                            type="datetime-local"
                            {...register('endDate', { required: 'End date is required' })}
                            className={`mt-1 block w-full px-3 py-2 border ${errors.endDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>}
                    </div>
                </div>

                 <div className="mb-4">
                    <label htmlFor="venue" className="block text-sm font-medium text-gray-700">Venue</label>
                    <input
                        id="venue"
                        type="text"
                        {...register('venue', { required: 'Venue is required' })}
                        className={`mt-1 block w-full px-3 py-2 border ${errors.venue ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {errors.venue && <p className="text-red-500 text-sm mt-1">{errors.venue.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                >
                    {isSubmitting ? 'Publishing Event...' : 'Publish Event'}
                </button>
            </form>
        </div>
    );
};

export default EventForm;
