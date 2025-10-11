import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="text-center py-20">
            <h1 className="text-6xl font-bold text-blue-600">404</h1>
            <p className="text-2xl font-semibold mt-4">Page Not Found</p>
            <p className="text-gray-600 mt-2">Sorry, the page you are looking for does not exist.</p>
            <div className="mt-8">
                <Link
                    to="/"
                    className="rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                >
                    Go back home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
