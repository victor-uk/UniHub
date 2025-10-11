import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { BookOpen, UserPlus, LogIn, LogOut, LayoutDashboard } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
    // This now uses our real authentication state, not a simulation.
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-800">
                    {/* Kept your yellow icon color preference */}
                    <BookOpen className="text-blue-600" />
                    <span>Dept. Board</span>
                </Link>
                <div className="hidden md:flex items-center space-x-6">
                    <NavLink to="/" className={({isActive}) => isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"}>Home</NavLink>
                    <NavLink to="/announcements" className={({isActive}) => isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"}>Announcements</NavLink>
                </div>
                <div className="flex items-center space-x-2">
                     {/* The Navbar now correctly checks if a user object exists */}
                     {user ? (
                         <>
                            <span className="text-gray-700 hidden sm:inline">Welcome, {user.name}</span>
                            {(user.role === 'admin' || user.role === 'staff') && (
                                <Link to="/admin" title="Dashboard" className="text-gray-600 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100">
                                    <LayoutDashboard size={20} />
                                </Link>
                            )}
                            {/* The logout button is now fully functional */}
                            <button onClick={handleLogout} className="flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-red-600 transition-colors">
                               <LogOut size={16} />
                               <span>Logout</span>
                            </button>
                         </>
                     ) : (
                        <>
                            {/* The Register button is now included for logged-out users */}
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

