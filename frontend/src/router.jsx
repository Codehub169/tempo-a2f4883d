import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AuthPage from './pages/AuthPage';
import UserDashboardPage from './pages/UserDashboardPage';
import SellerDashboardPage from './pages/SellerDashboardPage';
import SellerProductManagementPage from './pages/SellerProductManagementPage';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/products", element: <ProductListingPage /> },
      { path: "/products/:productId", element: <ProductDetailsPage /> },
      { path: "/cart", element: <CartPage /> },
      { path: "/checkout", element: <CheckoutPage /> },
      { path: "/order-confirmation", element: <OrderConfirmationPage /> },
      { path: "/auth", element: <AuthPage /> },
      { path: "/dashboard", element: <UserDashboardPage /> },
      { path: "/seller/dashboard", element: <SellerDashboardPage /> },
      { path: "/seller/products", element: <SellerProductManagementPage /> },
      // TODO: Add a 404 Not Found page component here
      // { path: "*", element: <NotFoundPage /> }
    ]
  }
]);

export default router;