import React from 'react';
import { Link } from 'react-router-dom';

const AuthForm = ({ 
  isLogin, 
  formData, 
  handleInputChange, 
  handleSubmit, 
  error, 
  isLoading,
  switchToLogin,
  switchToRegister
}) => {

  const commonInputClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm";
  const primaryButtonClasses = "w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-md">
      <div className="flex border-b border-gray-200 mb-6">
        <button 
          type="button"
          onClick={switchToLogin}
          className={`flex-1 py-3 px-4 text-center font-medium border-b-2 focus:outline-none transition-colors ${isLogin ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          aria-pressed={isLogin}
        >
          Login
        </button>
        <button 
          type="button"
          onClick={switchToRegister}
          className={`flex-1 py-3 px-4 text-center font-medium border-b-2 focus:outline-none transition-colors ${!isLogin ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          aria-pressed={!isLogin}
        >
          Register
        </button>
      </div>

      {isLogin ? (
        // Login Form
        <div>
          <h2 className="text-2xl font-bold text-center mb-6">Welcome Back!</h2>
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <label htmlFor="login_email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                id="login_email" 
                name="email" 
                type="email" 
                autoComplete="email" 
                required 
                placeholder="you@example.com"
                value={formData.email || ''}
                onChange={handleInputChange}
                className={commonInputClasses}
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="login_password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                id="login_password" 
                name="password" 
                type="password" 
                autoComplete="current-password" 
                required 
                placeholder="••••••••"
                value={formData.password || ''}
                onChange={handleInputChange}
                className={commonInputClasses}
                aria-required="true"
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input id="remember_me" name="remember_me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <label htmlFor="remember_me" className="ml-2 block text-gray-900">Remember me</label>
              </div>
              <div>
                <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">Forgot password?</Link>
              </div>
            </div>
            {error && <p role="alert" className="text-sm text-red-600 text-center py-2 px-3 bg-red-50 rounded-md">{error}</p>}
            <div>
              <button 
                type="submit" 
                disabled={isLoading}
                className={primaryButtonClasses}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        // Register Form
        <div>
          <h2 className="text-2xl font-bold text-center mb-6">Create Your Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="register_name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                id="register_name" 
                name="name" 
                type="text" 
                autoComplete="name"
                required 
                placeholder="John Doe"
                value={formData.name || ''}
                onChange={handleInputChange}
                className={commonInputClasses}
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="register_email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                id="register_email" 
                name="email" 
                type="email" 
                autoComplete="email"
                required 
                placeholder="you@example.com"
                value={formData.email || ''}
                onChange={handleInputChange}
                className={commonInputClasses}
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="register_password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                id="register_password" 
                name="password" 
                type="password" 
                autoComplete="new-password"
                required 
                placeholder="•••••••• (min. 8 characters)"
                value={formData.password || ''}
                onChange={handleInputChange}
                className={commonInputClasses}
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input 
                id="confirmPassword" 
                name="confirmPassword" 
                type="password" 
                autoComplete="new-password"
                required 
                placeholder="••••••••"
                value={formData.confirmPassword || ''}
                onChange={handleInputChange}
                className={commonInputClasses}
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">I want to register as a:</label>
              <select 
                id="role" 
                name="role" 
                required
                value={formData.role || ''}
                onChange={handleInputChange}
                className={commonInputClasses}
                aria-required="true"
              >
                <option value="" disabled>Select Role...</option>
                <option value="buyer">Buyer (I want to purchase products)</option>
                <option value="seller">Seller (I want to list and sell products)</option>
              </select>
            </div>
            {error && <p role="alert" className="text-sm text-red-600 text-center py-2 px-3 bg-red-50 rounded-md">{error}</p>}
            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isLoading}
                className={primaryButtonClasses}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      )}
      <p className="mt-6 text-center text-sm text-gray-600">
        By signing up, you agree to our <Link to="/terms" className="font-medium text-blue-600 hover:text-blue-500">Terms</Link> and <Link to="/privacy" className="font-medium text-blue-600 hover:text-blue-500">Privacy Policy</Link>.
      </p>
    </div>
  );
};

export default AuthForm;
