import React from 'react';

const StatCard = ({ icon, title, value }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center space-x-4 transition-colors duration-300">
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full">
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;

