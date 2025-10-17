import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Always start loading

    useEffect(() => {
        // This effect runs once when the app starts
        try {
            const userString = localStorage.getItem('user');
            if (userString) {
                const parsedUser = JSON.parse(userString);
                setUser(parsedUser);
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            localStorage.removeItem('user');
        } finally {
            // This is the key: always set loading to false after checking
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/api/auth/login', { email, password });
        if (data) {
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
        }
        return data;
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {/* Render children only when not loading */}
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;

