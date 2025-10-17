import React from 'react';
import useAuth from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { ArrowRight, LogIn, UserPlus } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import DashboardHome from '../components/dashboard/DashboardHome';

const PublicHome = () => (
    <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
            Welcome to the <span className="text-blue-600 dark:text-blue-400">UniHub</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
            Your central hub for all official announcements, events, and academic information.
        </p>
        <div className="mt-8 flex justify-center items-center flex-wrap gap-4">
            <Link to="/login" className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors shadow-lg">
                <LogIn size={20} />
                <span>Staff Login</span>
            </Link>
            <Link to="/register" className="flex items-center gap-2 bg-white dark:bg-gray-700 dark:hover:bg-gray-600 text-blue-600 dark:text-gray-100 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors border border-gray-300 dark:border-gray-600 shadow-lg">
                <UserPlus size={20} />
                <span>Create Student Account</span>
                <ArrowRight size={20} />
            </Link>
        </div>
        <div className="mt-12 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Recent Announcements</h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Please log in to view the latest announcements and events.</p>
        </div>
    </div>
);

const Home = () => {
    // We now get the 'loading' state from our context
    const { user, loading } = useAuth();

    // If the context is still loading, show a spinner
    if (loading) {
        return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;
    }

    // Otherwise, render the correct page
    return user ? <DashboardHome /> : <PublicHome />;
};

export default Home;

