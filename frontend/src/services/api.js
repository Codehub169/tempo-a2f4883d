import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api'; // Default to /api for proxy or same-origin

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Interceptor for response error handling (e.g., for 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access, e.g., redirect to login
      // localStorage.removeItem('token');
      // localStorage.removeItem('user');
      // window.location.href = '/login'; // Or use React Router's navigate
      console.error('Unauthorized access - 401. Token might be invalid or expired.');
    }
    return Promise.reject(error);
  }
);

export default api;

// Specific API functions (examples, can be expanded or organized elsewhere)

// Auth
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const registerUser = (userData) => api.post('/auth/register', userData);
export const getCurrentUser = () => api.get('/auth/me');

// Products
export const getProducts = (params) => api.get('/products', { params });
export const getProductById = (id) => api.get(`/products/${id}`);
export const createProduct = (productData) => api.post('/products', productData, {
  headers: { 'Content-Type': 'multipart/form-data' } // If handling file uploads
});
export const updateProduct = (id, productData) => api.put(`/products/${id}`, productData, {
  headers: { 'Content-Type': 'multipart/form-data' } // If handling file uploads
});
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const getSellerProducts = () => api.get('/products/seller'); // Assumes backend route for seller's products

// Cart (if backend cart is used)
// export const getCart = () => api.get('/cart');
// export const addToCartApi = (itemData) => api.post('/cart', itemData);
// export const removeFromCartApi = (itemId) => api.delete(`/cart/${itemId}`);
// export const updateCartItemApi = (itemId, updateData) => api.put(`/cart/${itemId}`, updateData);

// Orders
export const createOrder = (orderData) => api.post('/orders', orderData);
export const getUserOrders = () => api.get('/orders/my-orders');
export const getOrderById = (id) => api.get(`/orders/${id}`);

// Users
export const updateUserProfile = (userData) => api.put('/users/profile', userData);

