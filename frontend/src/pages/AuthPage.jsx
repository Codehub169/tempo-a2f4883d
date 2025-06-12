import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AuthPage = () => {
    const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
    const navigate = useNavigate();

    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        userRole: ''
    });

    const handleLoginChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleRegisterChange = (e) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement actual login logic with AuthContext/API
        console.log('Login attempt:', loginData);
        // Simulate successful login and redirect
        // In a real app, AuthContext would set user and token
        alert('Login successful (simulated)! Redirecting to homepage.');
        navigate('/'); 
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        if (registerData.password !== registerData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        if (!registerData.userRole) {
            alert('Please select a user role.');
            return;
        }
        // TODO: Implement actual registration logic with AuthContext/API
        console.log('Register attempt:', registerData);
        // Simulate successful registration and redirect
        alert('Registration successful (simulated)! Please login.');
        setActiveTab('login'); // Switch to login tab after registration
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-center">
                    <Link to="/" className="flex-shrink-0">
                        <span className="text-2xl font-bold text-blue-600">Re<span className="text-gray-700">New</span></span>
                    </Link>
                </div>
            </header>

            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                    <div className="flex border-b border-gray-200 mb-6">
                        <button 
                            className={`flex-1 py-3 px-4 text-center font-medium border-b-2 focus:outline-none ${activeTab === 'login' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                            onClick={() => setActiveTab('login')}
                        >
                            Login
                        </button>
                        <button 
                            className={`flex-1 py-3 px-4 text-center font-medium border-b-2 focus:outline-none ${activeTab === 'register' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                            onClick={() => setActiveTab('register')}
                        >
                            Register
                        </button>
                    </div>

                    {/* Login Form */}
                    {activeTab === 'login' && (
                        <div id="loginForm">
                            <h2 className="text-2xl font-bold text-center mb-6">Welcome Back!</h2>
                            <form onSubmit={handleLoginSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="login_email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input id="login_email" name="email" type="email" value={loginData.email} onChange={handleLoginChange} autoComplete="email" required placeholder="you@example.com" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="login_password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <input id="login_password" name="password" type="password" value={loginData.password} onChange={handleLoginChange} autoComplete="current-password" required placeholder="••••••••" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input id="remember_me" name="remember_me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                        <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">Remember me</label>
                                    </div>
                                    <div className="text-sm">
                                        <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Forgot your password?</a>
                                    </div>
                                </div>
                                <div>
                                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out">Sign In</button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Register Form */}
                    {activeTab === 'register' && (
                        <div id="registerForm">
                            <h2 className="text-2xl font-bold text-center mb-6">Create Your Account</h2>
                            <form onSubmit={handleRegisterSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="register_name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input id="register_name" name="name" type="text" value={registerData.name} onChange={handleRegisterChange} required placeholder="John Doe" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="register_email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input id="register_email" name="email" type="email" value={registerData.email} onChange={handleRegisterChange} required placeholder="you@example.com" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="register_password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <input id="register_password" name="password" type="password" value={registerData.password} onChange={handleRegisterChange} required placeholder="••••••••" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                    <input id="confirm_password" name="confirmPassword" type="password" value={registerData.confirmPassword} onChange={handleRegisterChange} required placeholder="••••••••" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="user_role" className="block text-sm font-medium text-gray-700 mb-1">I want to register as a:</label>
                                    <select id="user_role" name="userRole" value={registerData.userRole} onChange={handleRegisterChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                        <option value="" disabled>Select Role...</option>
                                        <option value="buyer">Buyer (I want to purchase products)</option>
                                        <option value="seller">Seller (I want to list and sell products)</option>
                                    </select>
                                </div>
                                <div className="pt-2">
                                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out">Create Account</button>
                                </div>
                            </form>
                        </div>
                    )}
                    <p className="mt-6 text-center text-sm text-gray-600">
                        By signing up, you agree to our <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Terms</a> and <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Privacy Policy</a>.
                    </p>
                </div>
            </main>

            <footer className="bg-gray-100 text-gray-600 py-8 border-t mt-auto">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
                    <p>&copy; 2024 ReNew Marketplace. All rights reserved. Prototype for design purposes.</p>
                </div>
            </footer>
        </div>
    );
};

export default AuthPage;
