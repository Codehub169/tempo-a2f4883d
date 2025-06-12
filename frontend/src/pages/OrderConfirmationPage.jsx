import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const OrderConfirmationPage = () => {
    const location = useLocation();
    // Attempt to get order details passed from checkout, or use defaults
    const orderDetails = location.state?.orderDetails || {};
    const totalAmount = location.state?.totalAmount || 670.84; // Default or from state
    const orderNumber = location.state?.orderNumber || `RNM${Math.floor(Math.random() * 900000000) + 100000000}`;
    const userEmail = orderDetails.email || 'your.email@example.com';

    // Simulated cart items for display if not passed explicitly (should come from order context/API in real app)
    const items = location.state?.items || [
        { name: 'Energy Star Fridge', quantity: 1, price: 399.00 },
        { name: 'Smartphone XYZ', quantity: 1, price: 199.00 },
    ];
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 25.00; // Simulated
    const tax = subtotal * 0.08; // Simulated

    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-center">
                    <Link to="/" className="flex-shrink-0">
                        <span className="text-2xl font-bold text-blue-600">Re<span className="text-gray-700">New</span></span>
                    </Link>
                </div>
            </header>

            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center">
                <div className="bg-white p-8 md:p-12 rounded-lg shadow-xl text-center max-w-2xl w-full">
                    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
                        <svg className="h-10 w-10 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-green-500 mb-3">Thank You For Your Order!</h1>
                    <p className="text-gray-700 text-lg mb-2">Your order <strong className="text-blue-600">#{orderNumber}</strong> has been placed successfully.</p>
                    <p className="text-gray-600 mb-6">A confirmation email with your order details has been sent to {userEmail}.</p>

                    <div className="border-t border-b border-gray-200 my-6 py-6 text-left">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                        {items.map((item, index) => (
                             <div key={index} className="flex justify-between items-center mb-2">
                                <p className="text-gray-700">{item.name} (x{item.quantity})</p>
                                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                       
                        <div className="flex justify-between text-gray-600 mt-4">
                            <p>Subtotal:</p><p>${subtotal.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <p>Shipping:</p><p>${shipping.toFixed(2)}</p>
                        </div>
                         <div className="flex justify-between text-gray-600">
                            <p>Tax:</p><p>${tax.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                            <p>Total Paid:</p><p>${totalAmount.toFixed(2)}</p>
                        </div>
                    </div>
                    
                    <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 ease-in-out text-lg inline-block">
                        Continue Shopping
                    </Link>
                    <Link to="/dashboard/orders" className="mt-4 block text-blue-600 hover:underline">
                        View Order History
                    </Link>
                </div>
            </main>

            <footer className="bg-gray-100 text-gray-600 py-8 border-t">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
                    <p>&copy; 2024 ReNew Marketplace. All rights reserved. Prototype for design purposes.</p>
                </div>
            </footer>
        </div>
    );
};

export default OrderConfirmationPage;
