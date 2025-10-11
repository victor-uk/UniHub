import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { BookOpen, UserPlus, LogIn, LogOut, LayoutDashboard, Calendar, Clock } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-800">
                    <BookOpen className="text-blue-600" />
                    <span>Dept. Board</span>
                </Link>
                
                {/* Main navigation links */}
                <div className="hidden md:flex items-center space-x-6">
                    <NavLink to="/" className={({isActive}) => isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"}>Home</NavLink>
                    <NavLink to="/announcements" className={({isActive}) => isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"}>Announcements</NavLink>
                    {/* These are the new links */}
                    <NavLink to="/events" className={({isActive}) => isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"}>Events</NavLink>
                    <NavLink to="/timetable" className={({isActive}) => isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"}>Timetable</NavLink>
                </div>
                
                {/* Authentication-related links */}
                <div className="flex items-center space-x-2">
                    {user ? (
                        <>
                            <span className="text-gray-700 hidden sm:inline">Welcome, {user.name}</span>
                            {(user.role === 'admin' || user.role === 'staff') && (
                                <Link to="/admin" title="Dashboard" className="text-gray-600 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100">
                                    <LayoutDashboard size={20} />
                                </Link>
                            )}
                            <button onClick={logout} className="flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-red-600 transition-colors">
                                <LogOut size={16} />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/register" className="hidden sm:flex items-center gap-2 text-gray-600 font-semibold px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors">
                                <UserPlus size={18} />
                                <span>Register</span>
                            </Link>
                            <Link to="/login" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors">
                                <LogIn size={18} />
                                <span>Login</span>
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;

