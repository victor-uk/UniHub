import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Register = () => {
    const { register: registerUser, error, setError } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
    const password = watch("password", "");

    useEffect(() => {
        return () => setError(null);
    }, [setError]);

    const onSubmit = async (data) => {
        try {
            // We don't need email verification for this phase, so role is hardcoded
            await registerUser({ name: data.name, email: data.email, password: data.password, role: 'student' });
            navigate('/');
        } catch (err) {
            // Error is handled in context
        }
    };

    return (
        <div className="flex items-center justify-center py-12">
            <div className="mx-auto w-full max-w-sm">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                        Create an Account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Get started by creating your student account
                    </p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-8 shadow-lg rounded-lg border">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative flex items-center" role="alert">
                            <AlertTriangle className="mr-2" size={18} />
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    
                    <div>
                        <label className="block text-sm font-medium">Full Name</label>
                        <input
                            type="text"
                            {...register('name', { required: 'Full name is required' })}
                            className={`mt-1 block w-full rounded-md border-0 py-2 px-3 shadow-sm ring-1 ring-inset ${errors.name ? 'ring-red-500' : 'ring-gray-300'} focus:ring-2 focus:ring-blue-600`}
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Email Address</label>
                        <input
                            type="email"
                            {...register('email', { required: 'Email is required' })}
                            className={`mt-1 block w-full rounded-md border-0 py-2 px-3 shadow-sm ring-1 ring-inset ${errors.email ? 'ring-red-500' : 'ring-gray-300'} focus:ring-2 focus:ring-blue-600`}
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Password</label>
                        <input
                            type="password"
                            {...register('password', { 
                                required: 'Password is required', 
                                minLength: { value: 6, message: 'Password must be at least 6 characters' } 
                            })}
                            className={`mt-1 block w-full rounded-md border-0 py-2 px-3 shadow-sm ring-1 ring-inset ${errors.password ? 'ring-red-500' : 'ring-gray-300'} focus:ring-2 focus:ring-blue-600`}
                        />
                        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Confirm Password</label>
                        <input
                            type="password"
                            {...register('confirmPassword', {
                                required: "Please confirm your password",
                                validate: value => value === password || "Passwords do not match"
                            })}
                            className={`mt-1 block w-full rounded-md border-0 py-2 px-3 shadow-sm ring-1 ring-inset ${errors.confirmPassword ? 'ring-red-500' : 'ring-gray-300'} focus:ring-2 focus:ring-blue-600`}
                        />
                        {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex w-full justify-center items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:bg-blue-400"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" /> : 'Create Account'}
                        </button>
                    </div>
                     <p className="mt-4 text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold leading-6 text-blue-600 hover:text-blue-500">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
