import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import { Clock, MapPin, User, BookOpen, Calendar, Filter, X } from 'lucide-react';

const TimetablePage = () => {
    const [allEntries, setAllEntries] = useState([]);
    const [filteredTimetables, setFilteredTimetables] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // State for filters
    const [selectedLevel, setSelectedLevel] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');

    // Memoize unique levels and departments to avoid recalculation
    const { levels, departments } = useMemo(() => {
        const levels = [...new Set(allEntries.map(item => item.level))].sort((a, b) => a - b);
        const departments = [...new Set(allEntries.map(item => item.department))].sort();
        return { levels, departments };
    }, [allEntries]);

    // Effect for fetching initial data
    useEffect(() => {
        const fetchTimetables = async () => {
            try {
                const { data } = await api.get('api/timetables');
                setAllEntries(data);
            } catch (err) {
                setError('Failed to fetch timetables. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchTimetables();
    }, []);

    // Effect for applying filters and grouping data
    useEffect(() => {
        let filteredData = allEntries;

        if (selectedLevel) {
            filteredData = filteredData.filter(entry => entry.level === parseInt(selectedLevel));
        }

        if (selectedDepartment) {
            filteredData = filteredData.filter(entry => entry.department === selectedDepartment);
        }
        
        const groupedByDay = filteredData.reduce((acc, item) => {
            const day = item.dayOfWeek;
            if (!acc[day]) {
                acc[day] = [];
            }
            acc[day].push(item);
            return acc;
        }, {});
        
        const daysOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        const sortedGroupedByDay = {};
        daysOrder.forEach(day => {
            if (groupedByDay[day]) {
                sortedGroupedByDay[day] = groupedByDay[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
            }
        });

        setFilteredTimetables(sortedGroupedByDay);
    }, [allEntries, selectedLevel, selectedDepartment]);
    
    const handleResetFilters = () => {
        setSelectedLevel('');
        setSelectedDepartment('');
    };

    if (loading) {
        return <div className="text-center py-10">Loading Timetable...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-6 text-center">Class Timetable</h1>

            {/* Filter Section */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-8 flex flex-col sm:flex-row items-center gap-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-700"><Filter size={20} /> Filters:</h3>
                <select 
                    value={selectedLevel} 
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full sm:w-auto p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">All Levels</option>
                    {levels.map(level => <option key={level} value={level}>{level} Level</option>)}
                </select>
                <select 
                    value={selectedDepartment} 
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full sm:w-auto p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">All Departments</option>
                    {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                </select>
                <button 
                    onClick={handleResetFilters}
                    className="w-full sm:w-auto bg-gray-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                    <X size={18} /> Reset
                </button>
            </div>
            
            <div className="space-y-8">
                {Object.keys(filteredTimetables).length > 0 ? (
                    Object.entries(filteredTimetables).map(([day, entries]) => (
                        <div key={day} className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold mb-4 border-b pb-2 flex items-center gap-2">
                                <Calendar size={24} className="text-blue-600" />
                                {day}
                            </h2>
                            <div className="divide-y divide-gray-200">
                                {entries.map(entry => (
                                    <div key={entry._id} className="py-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                        <div className="md:col-span-1">
                                            <p className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                                <BookOpen size={20} className="text-gray-500" />
                                                {entry.courseTitle} ({entry.courseCode})
                                            </p>
                                            <p className="text-sm text-gray-600">Level: {entry.level} | Dept: {entry.department}</p>
                                        </div>
                                        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-700">
                                            <p className="flex items-center gap-2"><Clock size={16} /> {entry.startTime} - {entry.endTime}</p>
                                            <p className="flex items-center gap-2"><MapPin size={16} /> {entry.venue}</p>
                                            <p className="flex items-center gap-2"><User size={16} /> {entry.lecturer || 'N/A'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 bg-white rounded-lg shadow-md">
                        <p className="text-gray-600">No timetable entries match the current filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TimetablePage;

