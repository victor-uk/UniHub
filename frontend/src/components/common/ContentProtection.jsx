import React from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from '../ui/LoadingSpinner';

const ContentProtection = ({ children }) => {
    const { user, loading } = useAuth();

    // Show a loading spinner while authentication status is being checked
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner />
            </div>
        );
    }

    // If loading is finished and there is no user, show the login prompt
    if (!user) {
        return (
            <div className="text-center bg-white p-10 rounded-lg shadow-md max-w-lg mx-auto">
                <Lock className="mx-auto h-12 w-12 text-yellow-500" />
                <h2 className="mt-6 text-2xl font-bold text-gray-900">Content Locked</h2>
                <p className="mt-2 text-gray-600">
                    You must be logged in to view this page. Please log in or create an account to access announcements, events, and timetables.
                </p>
                <div className="mt-6">
                    <Link
                        to="/login"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    // If the user is logged in, render the actual page content
    return children;
};

export default ContentProtection;
