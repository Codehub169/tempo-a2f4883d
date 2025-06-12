import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: 'United States',
        phone: '',
        paymentMethod: 'card'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, you would process the order here (e.g., API call)
        console.log('Order submitted:', formData);
        // Pass order details to confirmation page if needed, or fetch from context/API there
        navigate('/order-confirmation', { state: { orderDetails: formData, totalAmount: 670.84 } }); 
    };

    // Simulated order summary data (ideally from CartContext)
    const orderSummary = {
        items: [
            { id: 1, name: 'Energy Star Fridge', quantity: 1, price: 399.00, image: 'https://placehold.co/60x60/007BFF/white?text=F' },
            { id: 2, name: 'Smartphone XYZ', quantity: 1, price: 199.00, image: 'https://placehold.co/60x60/FFC107/black?text=M' },
        ],
        subtotal: 598.00,
        shipping: 25.00,
        tax: 47.84,
        total: 670.84
    };

    return (
        <>
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <Link to="/" className="flex-shrink-0">
                        <span className="text-2xl font-bold text-blue-600">Re<span className="text-gray-700">New</span></span>
                    </Link>
                    <Link to="/cart" className="text-sm text-blue-600 hover:underline">&larr; Back to Cart</Link>
                </div>
            </header>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

                <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
                    {/* Checkout Form */}
                    <div className="lg:w-2/3">
                        {/* Shipping Address */}
                        <section className="bg-white p-6 rounded-lg shadow-lg mb-8">
                            <h2 className="text-xl font-semibold mb-4">1. Shipping Address</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="john.doe@example.com" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                    <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} placeholder="123 Main St" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} placeholder="Anytown" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State / Province</label>
                                    <input type="text" id="state" name="state" value={formData.state} onChange={handleChange} placeholder="CA" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">ZIP / Postal Code</label>
                                    <input type="text" id="zip" name="zip" value={formData.zip} onChange={handleChange} placeholder="90210" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                                <div>
                                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                    <select id="country" name="country" value={formData.country} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                        <option>United States</option>
                                        <option>Canada</option>
                                        <option>United Kingdom</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
                                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="(555) 123-4567" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                </div>
                            </div>
                        </section>

                        {/* Payment Method (Simulated) */}
                        <section className="bg-white p-6 rounded-lg shadow-lg mb-8">
                            <h2 className="text-xl font-semibold mb-4">2. Payment Method</h2>
                            <p className="text-gray-600 mb-4">This is a design prototype. Payment processing is simulated.</p>
                            <div className="space-y-3">
                                <div>
                                    <label className="inline-flex items-center">
                                        <input type="radio" className="form-radio text-blue-600" name="paymentMethod" value="card" checked={formData.paymentMethod === 'card'} onChange={handleChange} />
                                        <span className="ml-2">Credit/Debit Card (Simulated)</span>
                                    </label>
                                </div>
                                <div>
                                    <label className="inline-flex items-center">
                                        <input type="radio" className="form-radio text-blue-600" name="paymentMethod" value="paypal" checked={formData.paymentMethod === 'paypal'} onChange={handleChange} />
                                        <span className="ml-2">PayPal (Simulated)</span>
                                    </label>
                                </div>
                            </div>
                            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                                <p className="text-sm text-blue-700">No actual payment will be processed. Click "Place Order" to see the confirmation page.</p>
                            </div>
                        </section>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-white shadow-lg rounded-lg p-6 sticky top-24">
                            <h2 className="text-xl font-semibold mb-6 border-b pb-3">Order Summary</h2>
                            {orderSummary.items.map(item => (
                                <div key={item.id} className="flex justify-between items-center mb-3">
                                    <div className="flex items-center">
                                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-md mr-3" />
                                        <div>
                                            <p className="font-medium text-sm">{item.name}</p>
                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-medium text-sm">${item.price.toFixed(2)}</p>
                                </div>
                            ))}

                            <div className="border-t border-gray-200 pt-4 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="font-semibold">${orderSummary.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping:</span>
                                    <span className="font-semibold">${orderSummary.shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tax:</span>
                                    <span className="font-semibold">${orderSummary.tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t">
                                    <span>Total:</span>
                                    <span>${orderSummary.total.toFixed(2)}</span>
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 ease-in-out text-lg block text-center mt-6">
                                Place Order
                            </button>
                        </div>
                    </div>
                </form>
            </main>

            <footer className="bg-gray-100 text-gray-600 py-8 mt-16 border-t">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
                    <p>&copy; 2024 ReNew Marketplace. All rights reserved. Prototype for design purposes.</p>
                    <p className="mt-1">Secure Checkout Simulation</p>
                </div>
            </footer>
        </>
    );
};

export default CheckoutPage;
