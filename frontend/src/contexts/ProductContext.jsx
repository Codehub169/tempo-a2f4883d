import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api'; // Using the configured Axios instance

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

// Hardcoded categories as per plan, can be fetched from backend later
const PREDEFINED_CATEGORIES = [
  { id: 'tvs', name: 'TVs' },
  { id: 'fridges', name: 'Refrigerators' },
  { id: 'mobiles', name: 'Mobile Phones' },
  { id: 'laptops', name: 'Laptops' },
];

// Hardcoded conditions as per plan
const PREDEFINED_CONDITIONS = [
    { id: 'like-new', name: 'Like New' },
    { id: 'excellent', name: 'Excellent' },
    { id: 'good', name: 'Good' },
];


export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [categories] = useState(PREDEFINED_CATEGORIES); // Static for now
  const [conditions] = useState(PREDEFINED_CONDITIONS); // Static for now
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });


  const fetchProducts = useCallback(async (queryParams = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/products', { params: queryParams });
      setProducts(response.data.products || []);
      setPagination({
        currentPage: response.data.currentPage || 1,
        totalPages: response.data.totalPages || 1,
        totalItems: response.data.totalItems || 0,
      });
      // Simple logic for featured products (e.g., first 4 or based on a flag)
      setFeaturedProducts((response.data.products || []).slice(0, 4));
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError(err.response?.data?.message || 'Failed to fetch products');
      setProducts([]);
      setFeaturedProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchProductById = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    setCurrentProduct(null);
    try {
      const response = await api.get(`/products/${id}`);
      setCurrentProduct(response.data);
      return response.data;
    } catch (err) {
      console.error(`Failed to fetch product ${id}:`, err);
      setError(err.response?.data?.message || `Failed to fetch product ${id}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const fetchSellerProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Assuming '/products/seller' is an authenticated route returning current seller's products
      const response = await api.get('/products/seller'); 
      setSellerProducts(response.data.products || []);
      // Optionally set pagination for seller products if backend supports it
    } catch (err) {
      console.error("Failed to fetch seller products:", err);
      setError(err.response?.data?.message || 'Failed to fetch seller products');
      setSellerProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (productData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/products', productData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Optionally, refresh seller products or add to list
      await fetchSellerProducts(); 
      return response.data;
    } catch (err) {
      console.error("Failed to create product:", err);
      setError(err.response?.data?.message || 'Failed to create product');
      throw err; // Re-throw to allow form to handle error
    } finally {
      setIsLoading(false);
    }
  }, [fetchSellerProducts]);

  const updateProduct = useCallback(async (productId, productData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.put(`/products/${productId}`, productData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Optionally, refresh seller products or update in list
      await fetchSellerProducts(); 
      if (currentProduct && currentProduct.id === productId) {
        setCurrentProduct(response.data); // Update current product if it's the one being edited
      }
      return response.data;
    } catch (err) {
      console.error(`Failed to update product ${productId}:`, err);
      setError(err.response?.data?.message || `Failed to update product ${productId}`);
      throw err; // Re-throw
    } finally {
      setIsLoading(false);
    }
  }, [fetchSellerProducts, currentProduct]);

  const deleteProduct = useCallback(async (productId) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.delete(`/products/${productId}`);
      // Refresh seller products or remove from list
      setSellerProducts(prev => prev.filter(p => p.id !== productId));
      if (currentProduct && currentProduct.id === productId) {
        setCurrentProduct(null);
      }
      return true;
    } catch (err) {
      console.error(`Failed to delete product ${productId}:`, err);
      setError(err.response?.data?.message || `Failed to delete product ${productId}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [currentProduct]);


  const value = {
    products,
    featuredProducts,
    currentProduct,
    sellerProducts,
    categories,
    conditions,
    isLoading,
    error,
    pagination,
    fetchProducts,
    fetchProductById,
    fetchSellerProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    setCurrentProduct, // Allow manual setting if needed
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};
