import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, AlertTriangle, Loader2 } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const Login = () => {
    const { login, error, setError } = useAuth();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await login(formData.email, formData.password);
            // Navigate based on user role - this will be handled by the login function
            navigate('/');
        } catch (err) {
            // Error is handled in context
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center justify-center py-12">
            <div className="mx-auto w-full max-w-sm">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                        Staff & Admin Login
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Access your dashboard to manage the board
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 shadow-lg rounded-lg border">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative flex items-center" role="alert">
                            <AlertTriangle className="mr-2" size={18} />
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex w-full justify-center items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-blue-400"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : null}
                            {isSubmitting ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
