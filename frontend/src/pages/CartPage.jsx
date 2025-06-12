import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Placeholder cart data - replace with CartContext later
const initialCartItems = [
    {
        id: 1,
        name: 'Energy Star Fridge - Refurbished',
        condition: 'Excellent',
        seller: 'EcoAppliances',
        price: 399.00,
        quantity: 1,
        image: 'https://placehold.co/100x100/007BFF/white?text=Fridge'
    },
    {
        id: 2,
        name: 'Smartphone XYZ - Certified Refurbished',
        condition: 'Good',
        seller: 'GadgetRenew',
        price: 199.00,
        quantity: 1,
        image: 'https://placehold.co/100x100/FFC107/black?text=Mobile'
    }
];

const CartPage = () => {
    const [cartItems, setCartItems] = useState(initialCartItems);
    const navigate = useNavigate();

    const handleQuantityChange = (id, newQuantity) => {
        const updatedItems = cartItems.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, parseInt(newQuantity)) } : item
        );
        setCartItems(updatedItems);
    };

    const handleRemoveItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    // Simulated tax and shipping for now
    const estimatedTax = subtotal * 0.08; // 8% tax
    const shippingCost = cartItems.length > 0 ? 25.00 : 0; // Flat shipping if items exist
    const total = subtotal + estimatedTax + shippingCost;

    // Update cart count in header (simulated)
    useEffect(() => {
        const cartLink = document.querySelector('a[href="/cart"]');
        if (cartLink) {
            cartLink.textContent = `Cart (${cartItems.reduce((acc, item) => acc + item.quantity, 0)})`;
        }
    }, [cartItems]);

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold mb-8 text-center md:text-left">Your Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                    <p className="text-xl text-gray-700 mb-4">Your cart is empty.</p>
                    <Link to="/products" className="btn-primary text-white bg-blue-600 hover:bg-blue-700 font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items */}
                    <div className="lg:w-2/3">
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex flex-col sm:flex-row items-center border-b border-gray-200 py-4 last:border-b-0">
                                    <img src={item.image} alt={item.name} className="w-24 h-24 sm:w-20 sm:h-20 object-cover rounded-md mr-0 sm:mr-4 mb-3 sm:mb-0" />
                                    <div className="flex-grow text-center sm:text-left">
                                        <h3 className="text-lg font-semibold">{item.name}</h3>
                                        <p className="text-sm text-gray-500">Condition: {item.condition}</p>
                                        <p className="text-sm text-gray-500">Sold by: {item.seller}</p>
                                    </div>
                                    <div className="my-3 sm:my-0 sm:mx-4 flex items-center">
                                        <label htmlFor={`quantity-${item.id}`} className="sr-only">Quantity</label>
                                        <input 
                                            type="number" 
                                            id={`quantity-${item.id}`}
                                            value={item.quantity} 
                                            min="1" 
                                            onChange={(e) => handleQuantityChange(item.id, e.target.value)} 
                                            className="w-16 p-2 border border-gray-300 rounded-md text-center"
                                        />
                                    </div>
                                    <p className="text-lg font-semibold primary-text w-24 text-center sm:text-right my-2 sm:my-0">${(item.price * item.quantity).toFixed(2)}</p>
                                    <button 
                                        onClick={() => handleRemoveItem(item.id)} 
                                        className="ml-0 sm:ml-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-md shadow-sm transition-all text-xs"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            
                            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center">
                                <Link to="/products" className="text-blue-600 hover:underline font-medium mb-4 sm:mb-0">
                                    &larr; Continue Shopping
                                </Link>
                                {/* <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-md">Update Cart</button> */}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-white shadow-lg rounded-lg p-6 sticky top-24">
                            <h2 className="text-2xl font-bold mb-6 border-b pb-3">Order Summary</h2>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping:</span>
                                    <span className="font-semibold">${shippingCost.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Estimated Tax:</span>
                                    <span className="font-semibold">${estimatedTax.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="border-t border-gray-200 pt-4">
                                <div className="flex justify-between text-xl font-bold mb-6">
                                    <span>Total:</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <button 
                                    onClick={() => navigate('/checkout')} 
                                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 ease-in-out text-lg block text-center"
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default CartPage;
