import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { UserPlus } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Register = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Watch the password field to compare for confirmation
    const password = watch('password');

    const onSubmit = async (data) => {
        setIsLoading(true);
        setError('');
        try {
            await api.post('/api/auth/register', data);
            navigate('/login'); // Redirect to login page after successful registration
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Create an Account</h2>
                        <p className="text-gray-600 dark:text-gray-400">Get started by creating your student account.</p>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-4" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="label dark:text-gray-300">Full Name</label>
                            <input
                                type="text"
                                {...register('name', { required: 'Full name is required' })}
                                className="input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                placeholder="John Doe"
                            />
                            {errors.name && <p className="error-text">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="label dark:text-gray-300">Email Address</label>
                            <input
                                type="email"
                                {...register('email', { required: 'Email is required' })}
                                className="input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                placeholder="you@example.com"
                            />
                            {errors.email && <p className="error-text">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="label dark:text-gray-300">Password</label>
                            <input
                                type="password"
                                {...register('password', { 
                                    required: 'Password is required',
                                    minLength: { value: 6, message: 'Password must be at least 6 characters' } 
                                })}
                                className="input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="error-text">{errors.password.message}</p>}
                        </div>

                        <div>
                            <label className="label dark:text-gray-300">Confirm Password</label>
                            <input
                                type="password"
                                {...register('confirmPassword', {
                                    required: 'Please confirm your password',
                                    validate: value => value === password || 'Passwords do not match'
                                })}
                                className="input dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                placeholder="••••••••"
                            />
                            {errors.confirmPassword && <p className="error-text">{errors.confirmPassword.message}</p>}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full btn-primary flex justify-center items-center gap-2"
                            >
                                {isLoading ? <LoadingSpinner /> : <><UserPlus size={18} /><span>Create Account</span></>}
                            </button>
                        </div>
                    </form>
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;

