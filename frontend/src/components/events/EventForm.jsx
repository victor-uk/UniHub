import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import ImageUpload from '../common/ImageUpload';
import LoadingSpinner from '../ui/LoadingSpinner';

const EventForm = ({ eventToEdit, onFormSubmit, onCancel }) => {
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState('');
    const [imageUrl, setImageUrl] = useState(eventToEdit?.image || null);

    useEffect(() => {
        if (eventToEdit) {
            reset({
                title: eventToEdit.title,
                description: eventToEdit.description,
                startDate: eventToEdit.startDate.substring(0, 16),
                endDate: eventToEdit.endDate.substring(0, 16),
                venue: eventToEdit.venue,
            });
            setImageUrl(eventToEdit.image);
        } else {
            reset({
                title: '',
                description: '',
                startDate: '',
                endDate: '',
                venue: '',
            });
            setImageUrl(null);
        }
    }, [eventToEdit, reset]);

    const handleImageUpload = (url) => {
        setImageUrl(url);
        setValue('image', url);
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setServerError('');
        const payload = { ...data, image: imageUrl };

        try {
            if (eventToEdit) {
                await api.put(`/api/events/${eventToEdit._id}`, payload);
            } else {
                await api.post('/api/events', payload);
            }
            onFormSubmit();
        } catch (error) {
            setServerError(error.response?.data?.message || 'An error occurred.');
            console.error('Failed to submit event:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {serverError && <div className="error-banner">{serverError}</div>}

            <input
                type="text"
                placeholder="Event Title"
                {...register('title', { required: 'Title is required' })}
                className="input"
            />
            {errors.title && <p className="error-text">{errors.title.message}</p>}
            
            <ImageUpload onUploadSuccess={handleImageUpload} initialImage={imageUrl} />

            <textarea
                placeholder="Event Description"
                {...register('description', { required: 'Description is required' })}
                className="input h-24"
            />
            {errors.description && <p className="error-text">{errors.description.message}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="label">Start Date & Time</label>
                    <input type="datetime-local" {...register('startDate', { required: 'Start date is required' })} className="input"/>
                    {errors.startDate && <p className="error-text">{errors.startDate.message}</p>}
                </div>
                <div>
                    <label className="label">End Date & Time</label>
                    <input type="datetime-local" {...register('endDate', { required: 'End date is required' })} className="input"/>
                    {errors.endDate && <p className="error-text">{errors.endDate.message}</p>}
                </div>
            </div>
            
            <input
                type="text"
                placeholder="Venue"
                {...register('venue', { required: 'Venue is required' })}
                className="input"
            />
            {errors.venue && <p className="error-text">{errors.venue.message}</p>}

            <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="btn-primary">
                    {isSubmitting ? <LoadingSpinner /> : (eventToEdit ? 'Update Event' : 'Publish Event')}
                </button>
            </div>
        </form>
    );
};

export default EventForm;

