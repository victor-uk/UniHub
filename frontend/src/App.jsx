import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Announcements from './pages/Announcements';
import Events from './pages/Events';
import Timetable from './pages/Timetable';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/common/PrivateRoute';
import ContentProtection from './components/common/ContentProtection';
import useDarkMode from './hooks/useDarkMode';

function App() {
  useDarkMode();

  return (
    <AuthProvider>
      <Router>
        {/* The background color classes have been removed from this div to allow the body background to show */}
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route 
                path="/announcements" 
                element={<ContentProtection><Announcements /></ContentProtection>} 
              />
              <Route 
                path="/events" 
                element={<ContentProtection><Events /></ContentProtection>} 
              />
              <Route 
                path="/timetable" 
                element={<ContentProtection><Timetable /></ContentProtection>} 
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/admin" 
                element={
                  <PrivateRoute>
                    <AdminDashboard />
                  </PrivateRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

