import React, { useState, useEffect, useMemo } from 'react';
import useAuth from '../hooks/useAuth';
import api from '../services/api';
import socketIOClient from 'socket.io-client';
import { Trash2, Edit, AlertTriangle, Clock, BookOpen, User, MapPin } from 'lucide-react';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import TimetableForm from '../components/timetable/TimetableForm';

const Timetable = () => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    // State for modals
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [entryToDelete, setEntryToDelete] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [entryToEdit, setEntryToEdit] = useState(null);
    
    // State for filters
    const [levelFilter, setLevelFilter] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const { data } = await api.get('/api/timetables');
                setEntries(data);
            } catch (error) {
                console.error('Failed to fetch timetable entries:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEntries();

        const socket = socketIOClient(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000');
        
        socket.on('new_timetable_entry', (newEntry) => {
            setEntries(prev => [...prev, newEntry]);
        });

        socket.on('timetable_entry_updated', (updatedEntry) => {
            setEntries(prev => prev.map(entry => 
                entry._id === updatedEntry._id ? updatedEntry : entry
            ));
        });

        socket.on('timetable_entry_deleted', (deletedId) => {
            setEntries(prev => prev.filter(item => item._id !== deletedId));
        });
        
        return () => socket.disconnect();
    }, []);

    const handleDeleteClick = (entry) => {
        setEntryToDelete(entry);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!entryToDelete) return;
        try {
            await api.delete(`/api/timetables/${entryToDelete._id}`);
        } catch (error) {
            console.error('Failed to delete entry:', error);
        } finally {
            setIsDeleteModalOpen(false);
            setEntryToDelete(null);
        }
    };
    
    const handleEditClick = (entry) => {
        setEntryToEdit(entry);
        setIsEditModalOpen(true);
    };

    const handleFormSubmit = () => {
        setIsEditModalOpen(false);
        setEntryToEdit(null);
    };

    const uniqueLevels = useMemo(() => [...new Set(entries.map(e => e.level))].sort(), [entries]);

    const filteredEntries = useMemo(() => {
        return entries.filter(entry => {
            const levelMatch = levelFilter ? entry.level === levelFilter : true;
            const departmentMatch = departmentFilter ? entry.department.toLowerCase().includes(departmentFilter.toLowerCase()) : true;
            return levelMatch && departmentMatch;
        });
    }, [entries, levelFilter, departmentFilter]);

    if (loading) {
        return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">Class Timetable</h1>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)} className="input">
                        <option value="">All Levels</option>
                        {uniqueLevels.map(level => <option key={level} value={level}>{level} Level</option>)}
                    </select>
                    <input type="text" placeholder="Filter by Department..." value={departmentFilter} onChange={e => setDepartmentFilter(e.target.value)} className="input" />
                    <button onClick={() => {setLevelFilter(''); setDepartmentFilter('');}} className="btn-secondary">Reset Filters</button>
                </div>
            </div>

            {days.map(day => {
                const dayEntries = filteredEntries.filter(e => e.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
                if (dayEntries.length === 0 && (levelFilter || departmentFilter)) return null;

                return (
                    <div key={day}>
                        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">{day}</h2>
                        {dayEntries.length === 0 ? (
                             <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                                <p className="text-gray-500 dark:text-gray-400">No classes scheduled for {day}.</p>
                            </div>
                        ) : (
                            <div className="md:bg-white md:dark:bg-gray-800 md:rounded-lg md:shadow">
                                <table className="hidden md:table min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="th">Time</th>
                                            <th className="th">Course</th>
                                            <th className="th">Lecturer</th>
                                            <th className="th">Venue</th>
                                            {user?.role === 'admin' && <th className="th text-right">Actions</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {dayEntries.map(entry => (
                                            <tr key={entry._id}>
                                                <td className="td whitespace-nowrap">{entry.startTime} - {entry.endTime}</td>
                                                <td className="td">
                                                    <div className="font-bold text-gray-800 dark:text-gray-100">{entry.courseCode}</div>
                                                    <div className="text-sm text-gray-600 dark:text-gray-300">{entry.courseTitle}</div>
                                                </td>
                                                <td className="td">{entry.lecturer}</td>
                                                <td className="td">{entry.venue}</td>
                                                {user?.role === 'admin' && (
                                                    <td className="td text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button onClick={() => handleEditClick(entry)} className="nav-icon-link" title="Edit"><Edit size={18} /></button>
                                                            <button onClick={() => handleDeleteClick(entry)} className="nav-icon-link" title="Delete"><Trash2 size={18} /></button>
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {/* Mobile Card View */}
                                <div className="md:hidden space-y-4">
                                    {dayEntries.map(entry => (
                                        <div key={entry._id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-bold text-gray-800 dark:text-gray-100">{entry.courseCode}</p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300">{entry.courseTitle}</p>
                                                </div>
                                                {user?.role === 'admin' && (
                                                    <div className="flex items-center gap-1">
                                                        <button onClick={() => handleEditClick(entry)} className="nav-icon-link" title="Edit"><Edit size={16} /></button>
                                                        <button onClick={() => handleDeleteClick(entry)} className="nav-icon-link" title="Delete"><Trash2 size={16} /></button>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mt-3 space-y-2 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-3">
                                                <p className="flex items-center gap-2"><Clock size={14} /> {entry.startTime} - {entry.endTime}</p>
                                                <p className="flex items-center gap-2"><User size={14} /> {entry.lecturer}</p>
                                                <p className="flex items-center gap-2"><MapPin size={14} /> {entry.venue}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
            
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Timetable Entry">
                <TimetableForm entryToEdit={entryToEdit} onFormSubmit={handleFormSubmit} onCancel={() => setIsEditModalOpen(false)} />
            </Modal>
            
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
                 <div className="text-center">
                    <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">Are you sure?</h3>
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">This will permanently delete the entry for <strong className="text-gray-800 dark:text-gray-200">{entryToDelete?.courseCode}</strong>.</p>
                    <div className="mt-6 flex justify-center gap-4">
                        <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="btn-secondary">Cancel</button>
                        <button type="button" onClick={confirmDelete} className="btn-danger">Delete</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Timetable;

