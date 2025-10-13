import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto transition-colors duration-300">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                    <p>&copy; {currentYear} Department Name. All Rights Reserved.</p>
                    <p className="mt-1">Developed for the Software Departmental Student Board Project</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

