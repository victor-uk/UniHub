import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { LogIn, AlertCircle } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Check for the 'sessionExpired' query parameter from the URL
    const [searchParams] = useSearchParams();
    const sessionExpired = searchParams.get('sessionExpired');

    useEffect(() => {
        // If the parameter is present, show a message
        if (sessionExpired) {
            setError('Your session has expired. Please log in again.');
        }
    }, [sessionExpired]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        setError('');
        try {
            await login(data.email, data.password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Welcome Back!</h2>
                        <p className="text-gray-600 dark:text-gray-400">Please sign in to your account.</p>
                    </div>

                    {error && (
                        <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-500/50 text-red-700 dark:text-red-300 px-4 py-3 rounded-md relative mb-4 flex items-center gap-2" role="alert">
                            <AlertCircle size={20} />
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="label dark:text-gray-300">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                {...register('email', { required: 'Email is required' })}
                                className="input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                placeholder="you@example.com"
                            />
                            {errors.email && <p className="error-text">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="label dark:text-gray-300">Password</label>
                            <input
                                id="password"
                                type="password"
                                {...register('password', { required: 'Password is required' })}
                                className="input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="error-text">{errors.password.message}</p>}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full btn-primary flex justify-center items-center gap-2"
                            >
                                {isLoading ? <LoadingSpinner /> : <><LogIn size={18} /><span>Sign In</span></>}
                            </button>
                        </div>
                    </form>
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;

