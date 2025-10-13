import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import api from '../services/api';
import socketIOClient from 'socket.io-client';
import { format, parseISO } from 'date-fns';
import { Trash2, Edit, AlertTriangle, User, Calendar, Tag } from 'lucide-react';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import AnnouncementForm from '../components/announcements/AnnouncementForm';

const AnnouncementCard = ({ announcement, onEdit, onDelete }) => {
    const { user } = useAuth();
    const canManage = user && (user.role === 'admin' || user.role === 'staff');
    
    const priorityStyles = {
        low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        normal: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
        high: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform hover:scale-105 duration-300">
            {announcement.image && (
                <img src={announcement.image} alt={announcement.title} className="w-full h-48 object-cover"/>
            )}
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex-1">{announcement.title}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${priorityStyles[announcement.priority]}`}>
                        {announcement.priority}
                    </span>
                </div>
                <div 
                    className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 mb-4 flex-grow"
                    dangerouslySetInnerHTML={{ __html: announcement.content }}
                />
                <div className="space-y-3 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4 mt-auto">
                    <div className="flex items-center gap-2">
                        <User size={16} />
                        <span>Posted by {announcement.author?.name || 'Admin'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>{format(parseISO(announcement.createdAt), 'PPP')}</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <Tag size={16} />
                        <span>{announcement.department}</span>
                    </div>
                </div>
                {canManage && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
                        <button onClick={() => onEdit(announcement)} className="nav-icon-link" title="Edit"><Edit size={18} /></button>
                        <button onClick={() => onDelete(announcement)} className="nav-icon-link" title="Delete"><Trash2 size={18} /></button>
                    </div>
                )}
            </div>
        </div>
    );
};


const Announcements = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalState, setModalState] = useState({ type: null, item: null });

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const { data } = await api.get('/api/announcements');
                setAnnouncements(data);
            } catch (error) {
                console.error('Failed to fetch announcements:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnnouncements();

        const socket = socketIOClient(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000');
        socket.on('new_announcement', (newItem) => setAnnouncements(prev => [newItem, ...prev]));
        socket.on('announcement_updated', (updatedItem) => {
            setAnnouncements(prev => prev.map(item => item._id === updatedItem._id ? updatedItem : item));
        });
        socket.on('announcement_deleted', (deletedId) => {
            setAnnouncements(prev => prev.filter(item => item._id !== deletedId));
        });
        return () => socket.disconnect();
    }, []);

    const openModal = (type, item) => setModalState({ type, item });
    const closeModal = () => setModalState({ type: null, item: null });

    const confirmDelete = async () => {
        if (modalState.type !== 'delete' || !modalState.item) return;
        try {
            await api.delete(`/api/announcements/${modalState.item._id}`);
            closeModal();
        } catch (error) {
            console.error('Failed to delete item:', error);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">Announcements</h1>
            
            {announcements.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <p className="text-gray-500 dark:text-gray-400">No announcements have been posted yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {announcements.map(announcement => (
                        <AnnouncementCard 
                            key={announcement._id} 
                            announcement={announcement} 
                            onEdit={(item) => openModal('edit', item)}
                            onDelete={(item) => openModal('delete', item)}
                        />
                    ))}
                </div>
            )}
            
            <Modal isOpen={modalState.type === 'edit'} onClose={closeModal} title="Edit Announcement">
                <AnnouncementForm 
                    announcementToEdit={modalState.item} 
                    onFormSubmit={closeModal} 
                    onCancel={closeModal} 
                />
            </Modal>
            
            <Modal isOpen={modalState.type === 'delete'} onClose={closeModal} title="Confirm Deletion">
                 <div className="text-center">
                    <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">Are you sure?</h3>
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">This will permanently delete the announcement: <strong className="text-gray-800 dark:text-gray-200">{modalState.item?.title}</strong>.</p>
                    <div className="mt-6 flex justify-center gap-4">
                        <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
                        <button type="button" onClick={confirmDelete} className="btn-danger">Delete</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Announcements;

