import React from 'react';
import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Persist user on refresh
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            api.get('/api/auth/me')
                .then(res => {
                    setUser(res.data);
                })
                .catch(() => {
                    // Token is invalid or expired
                    localStorage.removeItem('token');
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        try {
            setError(null);
            const { data } = await api.post('/api/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            const userResponse = await api.get('/api/auth/me');
            setUser(userResponse.data);
            // Navigation will be handled by the component calling login
        } catch (err) {
            console.error(err);
            const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
            setError(message);
            throw new Error(message);
        }
    };
    
    const register = async (userData) => {
         try {
            setError(null);
            const { data } = await api.post('/api/auth/register', userData);
            localStorage.setItem('token', data.token);
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            const userResponse = await api.get('/api/auth/me');
            setUser(userResponse.data);
            // Navigation will be handled by the component calling register
        } catch (err) {
            console.error('Registration error:', err);
            console.error('Error response:', err.response);
            console.error('Error data:', err.response?.data);
            const message = err.response?.data?.message || 'Registration failed. Please try again.';
            setError(message);
            throw new Error(message);
        }
    };


    const logout = () => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
        // Navigation will be handled by the component calling logout
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, logout, register, setError }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
