import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../../services/api';
import ImageUpload from '../common/ImageUpload'; // Import the new component
import LoadingSpinner from '../ui/LoadingSpinner';

const AnnouncementForm = ({ announcementToEdit, onFormSubmit, onCancel }) => {
    const { register, handleSubmit, control, setValue, reset, formState: { errors } } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState('');
    const [imageUrl, setImageUrl] = useState(announcementToEdit?.image || null);

    useEffect(() => {
        if (announcementToEdit) {
            // Pre-fill the form if we are editing
            reset({
                title: announcementToEdit.title,
                content: announcementToEdit.content,
                department: announcementToEdit.department,
                priority: announcementToEdit.priority,
            });
            setImageUrl(announcementToEdit.image);
        } else {
            // Ensure form is clear for new entries
            reset({
                title: '',
                content: '',
                department: 'General',
                priority: 'normal',
            });
            setImageUrl(null);
        }
    }, [announcementToEdit, reset]);

    const handleImageUpload = (url) => {
        setImageUrl(url); // Store the uploaded image URL in state
        setValue('image', url); // Also set it in the form data
    };
    
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        setServerError('');

        const payload = { ...data, image: imageUrl }; // Ensure image URL is in the payload

        try {
            if (announcementToEdit) {
                // Update existing announcement
                await api.put(`/api/announcements/${announcementToEdit._id}`, payload);
            } else {
                // Create new announcement
                await api.post('/api/announcements', payload);
            }
            onFormSubmit(); // Notify parent component of success
        } catch (error) {
            setServerError(error.response?.data?.message || 'An error occurred. Please try again.');
            console.error('Failed to submit announcement:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {serverError && <div className="error-banner">{serverError}</div>}
            
            <input
                type="text"
                placeholder="Announcement Title"
                {...register('title', { required: 'Title is required' })}
                className="input"
            />
            {errors.title && <p className="error-text">{errors.title.message}</p>}

            {/* Image Upload Component */}
            <ImageUpload onUploadSuccess={handleImageUpload} initialImage={imageUrl} />

            <Controller
                name="content"
                control={control}
                rules={{ required: 'Content is required' }}
                render={({ field }) => (
                    <ReactQuill 
                        theme="snow" 
                        value={field.value || ''} 
                        onChange={field.onChange} 
                        className="bg-white"
                    />
                )}
            />
            {errors.content && <p className="error-text">{errors.content.message}</p>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <input
                    type="text"
                    placeholder="Department (e.g., Computer Science)"
                    {...register('department', { required: 'Department is required' })}
                    className="input"
                />

                <select {...register('priority')} className="input">
                    <option value="normal">Normal Priority</option>
                    <option value="low">Low Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent</option>
                </select>
            </div>
            {errors.department && <p className="error-text">{errors.department.message}</p>}
            
            <div className="flex justify-end gap-4">
                <button type="button" onClick={onCancel} className="btn-secondary">
                    Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn-primary">
                    {isSubmitting ? <LoadingSpinner /> : (announcementToEdit ? 'Update Announcement' : 'Publish Announcement')}
                </button>
            </div>
        </form>
    );
};

export default AnnouncementForm;

