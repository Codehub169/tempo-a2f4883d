import React, { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import api from '../services/api'; // Assuming api service is set up

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          // Replace with your actual API endpoint for verifying token/fetching user
          const response = await api.get('/auth/me'); 
          setUser(response.data.user);
        } catch (err) {
          console.error('Token verification failed', err);
          localStorage.removeItem('authToken');
          setToken(null);
          setUser(null);
          api.defaults.headers.common['Authorization'] = null;
        }
      } else {
        // No token, ensure user is null and headers are clean
        setUser(null);
        api.defaults.headers.common['Authorization'] = null;
      }
      setIsLoading(false);
    };
    verifyToken();
  }, [token]);

  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', credentials);
      const { token: newToken, user: userData } = response.data;
      localStorage.setItem('authToken', newToken);
      setToken(newToken);
      setUser(userData);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      setIsLoading(false);
      return { success: true, user: userData };
    } catch (err) {
      console.error('Login failed', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      setIsLoading(false);
      return { success: false, error: err.response?.data?.message || 'Login failed.' };
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      // userData should include { name, email, password, role }
      const response = await api.post('/auth/register', userData);
      const { token: newToken, user: newUser } = response.data;
      localStorage.setItem('authToken', newToken);
      setToken(newToken);
      setUser(newUser);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      setIsLoading(false);
      return { success: true, user: newUser };
    } catch (err) {
      console.error('Registration failed', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setIsLoading(false);
      return { success: false, error: err.response?.data?.message || 'Registration failed.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    api.defaults.headers.common['Authorization'] = null;
    // Optionally, could call a backend logout endpoint
    // await api.post('/auth/logout');
    setError(null); // Clear any previous errors on logout
    console.log('User logged out');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user, // Derived state: user is authenticated if user object exists
    isLoading,
    error,
    login,
    register,
    logout,
    setUser, // Allow manual setting of user if needed (e.g., after profile update)
    setError, // To clear errors manually from components
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
