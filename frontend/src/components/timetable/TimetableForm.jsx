import React from 'react';
import { useForm } from 'react-hook-form';
import api from '../../services/api';
import { PlusCircle } from 'lucide-react';

const TimetableForm = ({ onTimetableCreated }) => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

    const onSubmit = async (data) => {
        try {
            const { data: newTimetable } = await api.post('/api/timetables', data);
            alert('Timetable entry created successfully!'); // Will replace with better notification later
            reset();
            if (onTimetableCreated) {
                onTimetableCreated(newTimetable);
            }
        } catch (error) {
            console.error('Failed to create timetable entry:', error);
            const errorMessage = error.response?.data?.message || 'Failed to create timetable entry. Please try again.';
            alert(errorMessage);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md w-full">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <PlusCircle className="text-blue-600" /> Add Timetable Entry
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="courseCode" className="block text-sm font-medium text-gray-700">Course Code</label>
                        <input
                            id="courseCode"
                            {...register('courseCode', { required: 'Course code is required' })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., CSC411"
                        />
                        {errors.courseCode && <p className="text-red-500 text-xs mt-1">{errors.courseCode.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="courseTitle" className="block text-sm font-medium text-gray-700">Course Title</label>
                        <input
                            id="courseTitle"
                            {...register('courseTitle', { required: 'Course title is required' })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., Software Engineering"
                        />
                        {errors.courseTitle && <p className="text-red-500 text-xs mt-1">{errors.courseTitle.message}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="dayOfWeek" className="block text-sm font-medium text-gray-700">Day of Week</label>
                        <select
                            id="dayOfWeek"
                            {...register('dayOfWeek', { required: 'Day is required' })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select a day...</option>
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                        </select>
                        {errors.dayOfWeek && <p className="text-red-500 text-xs mt-1">{errors.dayOfWeek.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
                        <input
                            type="time"
                            id="startTime"
                            {...register('startTime', { required: 'Start time is required' })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.startTime && <p className="text-red-500 text-xs mt-1">{errors.startTime.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
                        <input
                            type="time"
                            id="endTime"
                            {...register('endTime', { required: 'End time is required' })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.endTime && <p className="text-red-500 text-xs mt-1">{errors.endTime.message}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="venue" className="block text-sm font-medium text-gray-700">Venue</label>
                        <input
                            id="venue"
                            {...register('venue', { required: 'Venue is required' })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., LT1"
                        />
                        {errors.venue && <p className="text-red-500 text-xs mt-1">{errors.venue.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="level" className="block text-sm font-medium text-gray-700">Level</label>
                        <input
                            type="number"
                            id="level"
                            {...register('level', { required: 'Level is required', valueAsNumber: true })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., 400"
                        />
                        {errors.level && <p className="text-red-500 text-xs mt-1">{errors.level.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                        <input
                            id="department"
                            {...register('department', { required: 'Department is required' })}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., Computer Science"
                        />
                        {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department.message}</p>}
                    </div>
                </div>

                 <div>
                    <label htmlFor="lecturer" className="block text-sm font-medium text-gray-700">Lecturer (Optional)</label>
                    <input
                        id="lecturer"
                        {...register('lecturer')}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Dr. Smith"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                >
                    {isSubmitting ? 'Creating...' : 'Create Timetable Entry'}
                </button>
            </form>
        </div>
    );
};

export default TimetableForm;
