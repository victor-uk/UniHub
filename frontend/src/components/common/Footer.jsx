import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="container mx-auto px-4 py-6 text-center text-gray-500">
        <p>&copy; {currentYear} Department Name. All Rights Reserved.</p>
        <p className="text-sm mt-1">
          Developed for the MERN Departmental Student Board Project
        </p>
      </div>
    </footer>
  );
};

export default Footer;
