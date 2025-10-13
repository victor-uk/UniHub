import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../services/api';

// The component now accepts props to handle both create and edit modes
const TimetableForm = ({ entryToEdit, onFormSubmit, onCancel }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm();
    const [serverError, setServerError] = useState('');

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const levels = ['100', '200', '300', '400', '500'];

    // If we are in edit mode, populate the form with existing data
    useEffect(() => {
        if (entryToEdit) {
            setValue('courseCode', entryToEdit.courseCode);
            setValue('courseTitle', entryToEdit.courseTitle);
            setValue('day', entryToEdit.day);
            setValue('startTime', entryToEdit.startTime);
            setValue('endTime', entryToEdit.endTime);
            setValue('lecturer', entryToEdit.lecturer);
            setValue('venue', entryToEdit.venue);
            setValue('level', entryToEdit.level);
            setValue('department', entryToEdit.department);
        }
    }, [entryToEdit, setValue]);

    const onSubmit = async (data) => {
        setServerError('');
        try {
            let response;
            if (entryToEdit) {
                // Update existing entry
                response = await api.put(`/api/timetables/${entryToEdit._id}`, data);
            } else {
                // Create new entry
                response = await api.post('/api/timetables', data);
            }
            onFormSubmit(response.data);
        } catch (error) {
            const message = error.response?.data?.message || `Failed to ${entryToEdit ? 'update' : 'create'} entry.`;
            setServerError(message);
            console.error(`Failed to ${entryToEdit ? 'update' : 'create'} entry:`, error);
        }
    };
    
    const isEditMode = !!entryToEdit;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {serverError && <p className="text-red-500 bg-red-100 p-3 rounded-md">{serverError}</p>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="courseCode" className="block text-sm font-medium text-gray-700">Course Code</label>
                    <input id="courseCode" type="text" {...register('courseCode', { required: 'Course code is required' })} className="mt-1 block w-full input"/>
                    {errors.courseCode && <p className="text-red-500 text-xs mt-1">{errors.courseCode.message}</p>}
                </div>
                <div>
                    <label htmlFor="courseTitle" className="block text-sm font-medium text-gray-700">Course Title</label>
                    <input id="courseTitle" type="text" {...register('courseTitle', { required: 'Course title is required' })} className="mt-1 block w-full input"/>
                    {errors.courseTitle && <p className="text-red-500 text-xs mt-1">{errors.courseTitle.message}</p>}
                </div>
            </div>
            
            <div>
                <label htmlFor="day" className="block text-sm font-medium text-gray-700">Day of the Week</label>
                <select id="day" {...register('day', { required: 'Day is required' })} className="mt-1 block w-full input">
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                {errors.day && <p className="text-red-500 text-xs mt-1">{errors.day.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
                    <input id="startTime" type="time" {...register('startTime', { required: 'Start time is required' })} className="mt-1 block w-full input"/>
                    {errors.startTime && <p className="text-red-500 text-xs mt-1">{errors.startTime.message}</p>}
                </div>
                <div>
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
                    <input id="endTime" type="time" {...register('endTime', { required: 'End time is required' })} className="mt-1 block w-full input"/>
                    {errors.endTime && <p className="text-red-500 text-xs mt-1">{errors.endTime.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="lecturer" className="block text-sm font-medium text-gray-700">Lecturer</label>
                    <input id="lecturer" type="text" {...register('lecturer')} className="mt-1 block w-full input"/>
                </div>
                <div>
                    <label htmlFor="venue" className="block text-sm font-medium text-gray-700">Venue</label>
                    <input id="venue" type="text" {...register('venue', { required: 'Venue is required' })} className="mt-1 block w-full input"/>
                    {errors.venue && <p className="text-red-500 text-xs mt-1">{errors.venue.message}</p>}
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="level" className="block text-sm font-medium text-gray-700">Level</label>
                    <select id="level" {...register('level', { required: 'Level is required' })} className="mt-1 block w-full input">
                         {levels.map(l => <option key={l} value={l}>{l} Level</option>)}
                    </select>
                    {errors.level && <p className="text-red-500 text-xs mt-1">{errors.level.message}</p>}
                </div>
                <div>
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                    <input id="department" type="text" {...register('department', { required: 'Department is required' })} className="mt-1 block w-full input"/>
                    {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department.message}</p>}
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
                 {isEditMode && (
                    <button type="button" onClick={onCancel} disabled={isSubmitting} className="btn-secondary">
                        Cancel
                    </button>
                )}
                <button type="submit" disabled={isSubmitting} className="btn-primary">
                    {isSubmitting ? 'Submitting...' : (isEditMode ? 'Update Entry' : 'Add Entry')}
                </button>
            </div>
        </form>
    );
};

export default TimetableForm;

