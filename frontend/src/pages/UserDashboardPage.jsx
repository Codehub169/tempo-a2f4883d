import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const DashboardNavLink = ({ to, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    return (
        <Link 
            to={to} 
            className={`block px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-600 rounded-md transition-colors ${isActive ? 'bg-blue-500 text-white hover:bg-blue-600 hover:text-blue-500' : ''}`} 
        >
            {children}
        </Link>
    );
};

const OrderHistoryItem = ({ order }) => (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="flex justify-between items-start mb-2">
            <div>
                <h3 className="text-lg font-semibold text-[#007BFF]">Order #{order.id}</h3>
                <p className="text-sm text-gray-500">Date: {order.date}</p>
            </div>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {order.status}
            </span>
        </div>
        <div className="mb-3">
            {order.items.map(item => (
                <div key={item.id} className="flex items-center py-2 border-b last:border-b-0">
                    <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded mr-3"/>
                    <div className="flex-grow">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">${item.price.toFixed(2)}</p>
                </div>
            ))}
        </div>
        <div className="text-right">
            <p className="text-md font-semibold">Total: ${order.total.toFixed(2)}</p>
            <Link to={`/dashboard/user/orders/${order.id}`} className="text-sm text-blue-600 hover:underline mt-1 inline-block">View Details</Link>
        </div>
    </div>
);

const UserDashboardPage = () => {
    // Placeholder data - replace with API call and context
    const [activeTab, setActiveTab] = useState('order-history');
    const navigate = useNavigate();

    const user = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        address: '123 Main St, Anytown, CA 90210'
    };

    const orders = [
        {
            id: 'RNM123456789',
            date: 'October 26, 2023',
            status: 'Delivered',
            items: [
                { id: 1, name: 'Energy Star Fridge - Refurbished', quantity: 1, price: 399.00, imageUrl: 'https://placehold.co/100x100/007BFF/white?text=Fridge' },
                { id: 2, name: 'Smartphone XYZ - Certified Refurbished', quantity: 1, price: 199.00, imageUrl: 'https://placehold.co/100x100/FFC107/black?text=Mobile' },
            ],
            total: 645.84, // Including tax and shipping for example
        },
        {
            id: 'RNM987654321',
            date: 'September 15, 2023',
            status: 'Processing',
            items: [
                { id: 3, name: 'Refurbished Laptop Pro', quantity: 1, price: 599.50, imageUrl: 'https://placehold.co/100x100/6C757D/white?text=Laptop' },
            ],
            total: 620.00,
        },
    ];

    const handleLogout = () => {
        // Call logout from AuthContext
        console.log('User logged out');
        navigate('/auth');
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-6">My Profile</h2>
                        <form>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input type="text" id="name" defaultValue={user.name} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input type="email" id="email" defaultValue={user.email} readOnly className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <input type="text" id="address" defaultValue={user.address} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            </div>
                            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md">Save Changes</button>
                        </form>
                    </div>
                );
            case 'order-history':
                return (
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-6">Order History</h2>
                        {orders.length > 0 ? (
                            orders.map(order => <OrderHistoryItem key={order.id} order={order} />)
                        ) : (
                            <p>You have no past orders.</p>
                        )}
                    </div>
                );
            case 'settings':
                return (
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                        <p>Manage your notification preferences, password, and other account settings here.</p>
                        {/* Placeholder for settings form */}
                    </div>
                );
            default:
                return <Outlet />;
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row gap-8">
                <aside className="w-full md:w-1/4">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-['Poppins'] font-bold mb-4">My Account</h2>
                        <nav className="space-y-1">
                            <button onClick={() => setActiveTab('profile')} className={`block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-600 rounded-md transition-colors ${activeTab === 'profile' ? 'bg-blue-500 text-white hover:bg-blue-600 hover:text-blue-500' : ''}`}>Profile</button>
                            <button onClick={() => setActiveTab('order-history')} className={`block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-600 rounded-md transition-colors ${activeTab === 'order-history' ? 'bg-blue-500 text-white hover:bg-blue-600 hover:text-blue-500' : ''}`}>Order History</button>
                            <button onClick={() => setActiveTab('settings')} className={`block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-600 rounded-md transition-colors ${activeTab === 'settings' ? 'bg-blue-500 text-white hover:bg-blue-600 hover:text-blue-500' : ''}`}>Settings</button>
                            <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-100 hover:text-red-600 rounded-md transition-colors mt-4">Logout</button>
                        </nav>
                    </div>
                </aside>
                <main className="w-full md:w-3/4">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default UserDashboardPage;
