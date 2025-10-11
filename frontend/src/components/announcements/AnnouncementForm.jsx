import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles
import { Loader2 } from 'lucide-react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const AnnouncementForm = ({ setAnnouncements, onNewAnnouncement }) => {
    const { register, handleSubmit, control, formState: { errors, isSubmitting }, reset } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const response = await api.post('/api/announcements', data);
            // This is a simple way to update the list. For a more robust app,
            // you might use a state management library like React Query to auto-refetch.
            if(setAnnouncements) {
                setAnnouncements(prev => [response.data, ...prev]);
            }
            if(onNewAnnouncement) {
                onNewAnnouncement(response.data);
            }
            reset();
            // Optionally, navigate to the announcements page or show a success message
        } catch (error) {
            console.error('Failed to create announcement:', error);
            // You can set an error state here to show in the UI
        }
    };

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            ['link', 'image'],
            ['clean']
        ],
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 shadow-lg rounded-lg border">
            <h2 className="text-2xl font-bold">Create New Announcement</h2>
            <div>
                <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                    Title
                </label>
                <div className="mt-2">
                    <input
                        id="title"
                        type="text"
                        {...register('title', { required: 'Title is required' })}
                        className={`block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${errors.title ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm`}
                    />
                    {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
                </div>
            </div>

            <div>
                <label htmlFor="content" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                    Content
                </label>
                <Controller
                    name="content"
                    control={control}
                    rules={{ required: 'Content is required' }}
                    render={({ field }) => (
                        <ReactQuill 
                            theme="snow" 
                            modules={quillModules}
                            {...field} 
                        />
                    )}
                />
                {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>}
            </div>

            <div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full justify-center items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-blue-400"
                >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : 'Publish Announcement'}
                </button>
            </div>
        </form>
    );
};

export default AnnouncementForm;
