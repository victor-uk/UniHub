import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { BookOpen, UserPlus, LogIn, LogOut, LayoutDashboard, Menu, X, Sun, Moon } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useDarkMode from '../../hooks/useDarkMode';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [colorTheme, setTheme] = useDarkMode();

    const navLinks = (
        <>
            <NavLink to="/" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => isActive ? "nav-link-active" : "nav-link"}>Home</NavLink>
            <NavLink to="/announcements" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => isActive ? "nav-link-active" : "nav-link"}>Announcements</NavLink>
            <NavLink to="/events" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => isActive ? "nav-link-active" : "nav-link"}>Events</NavLink>
            <NavLink to="/timetable" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => isActive ? "nav-link-active" : "nav-link"}>Timetable</NavLink>
        </>
    );

    return (
        <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50 transition-colors duration-300">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-gray-100">
                        <BookOpen className="text-blue-600" />
                        <span>Dept. Board</span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-6">
                        {navLinks}
                    </div>

                    <div className="flex items-center">
                         {/* Theme Toggle Button */}
                        <button onClick={() => setTheme(colorTheme)} className="nav-icon-link hidden md:flex">
                            {colorTheme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <div className="hidden md:flex items-center space-x-2 ml-2">
                            {user ? (
                                <>
                                    {(user.role === 'admin' || user.role === 'staff') && (
                                        <Link to="/admin" title="Dashboard" className="nav-icon-link">
                                            <LayoutDashboard size={20} />
                                        </Link>
                                    )}
                                    <button onClick={logout} className="btn-logout">
                                        <LogOut size={16} />
                                        <span>Logout</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/register" className="nav-link hidden sm:flex items-center gap-2">
                                        <UserPlus size={18} />
                                        <span>Register</span>
                                    </Link>
                                    <Link to="/login" className="btn-primary flex items-center gap-2">
                                        <LogIn size={18} />
                                        <span>Login</span>
                                    </Link>
                                </>
                            )}
                        </div>
                         {/* Mobile Menu Button - Corrected isMenuOpen variable */}
                        <div className="md:hidden flex items-center ml-4">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                {isMenuOpen ? <X size={24} className="dark:text-white" /> : <Menu size={24} className="dark:text-white" />}
                            </button>
                        </div>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <nav className="flex flex-col space-y-4">
                            {navLinks}
                        </nav>
                        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col space-y-4">
                            {user ? (
                                <>
                                    {(user.role === 'admin' || user.role === 'staff') && (
                                        <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="nav-link flex items-center gap-2">
                                            <LayoutDashboard size={20} />
                                            <span>Dashboard</span>
                                        </Link>
                                    )}
                                    <button onClick={() => { logout(); setIsMenuOpen(false); }} className="btn-logout text-left w-full">
                                        <LogOut size={16} />
                                        <span>Logout</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/register" onClick={() => setIsMenuOpen(false)} className="nav-link flex items-center gap-2">
                                        <UserPlus size={18} />
                                        <span>Register</span>
                                    </Link>
                                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="btn-primary flex items-center justify-center gap-2">
                                        <LogIn size={18} />
                                        <span>Login</span>
                                    </Link>
                                </>
                            )}
                             <button onClick={() => setTheme(colorTheme)} className="nav-link flex items-center gap-2">
                                {colorTheme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
                                <span>Switch to {colorTheme === 'light' ? 'Light' : 'Dark'} Mode</span>
                            </button>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Navbar;

