import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { Loader2 } from 'lucide-react';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // While the authentication state is loading, show a spinner
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    // If loading is finished and there is no user, redirect to the login page
    // We also pass the original location they were trying to access
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If the user is logged in but is not an admin or staff, redirect them
    // For this app, we'll redirect them to the homepage.
    if (user.role !== 'admin' && user.role !== 'staff') {
        return <Navigate to="/" replace />;
    }
    
    // If the user is authenticated and authorized, render the child component
    return children;
};

export default PrivateRoute;
