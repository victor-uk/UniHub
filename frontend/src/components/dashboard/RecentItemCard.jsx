import React from 'react';
import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';

const RecentItemCard = ({ item, type }) => {
    const isEvent = type === 'event';
    const date = isEvent ? item.startDate : item.createdAt;
    const path = isEvent ? `/events` : `/announcements`;

    return (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 transition-colors duration-300">
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{isEvent ? 'Event' : 'Announcement'}</p>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mt-1">{item.title}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {isEvent ? 'Starts on' : 'Published on'} {format(parseISO(date), 'PPP')}
            </p>
            <Link to={path} className="text-sm text-blue-500 dark:text-blue-400 hover:underline mt-2 inline-block">View Details &rarr;</Link>
        </div>
    );
};

export default RecentItemCard;

