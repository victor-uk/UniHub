import React from 'react';

const StatCard = ({ icon, title, value, color = 'blue' }) => {

    const colorClasses = {
        blue: {
            bg: 'bg-blue-100 dark:bg-blue-900/20',
            text: 'text-blue-500 dark:text-blue-400'
        },
        green: {
            bg: 'bg-green-100 dark:bg-green-900/20',
            text: 'text-green-500 dark:text-green-400'
        },
        yellow: {
            bg: 'bg-yellow-100 dark:bg-yellow-900/20',
            text: 'text-yellow-500 dark:text-yellow-400'
        },
    };

    const selectedColor = colorClasses[color];

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center space-x-4 transition-colors duration-300">
            <div className={`p-3 rounded-full ${selectedColor.bg}`}>
                {React.cloneElement(icon, { className: selectedColor.text })}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;

