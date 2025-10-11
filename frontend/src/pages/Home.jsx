import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
        Welcome to the Departmental Notice Board
      </h1>
      <p className="mt-6 text-lg leading-8 text-gray-600">
        Your central hub for all official announcements, events, and academic information.
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <Link
          to="/announcements"
          className="rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 inline-flex items-center gap-2"
        >
          View Announcements <ArrowRight size={16} />
        </Link>
        <Link to="/login" className="text-sm font-semibold leading-6 text-gray-900">
          Staff Login <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
};

export default Home;
