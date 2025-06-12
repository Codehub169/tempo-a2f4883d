import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const DashboardNavLink = ({ to, children, action }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    if (action) {
        return (
            <button 
                onClick={action}
                className={`block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-600 rounded-md transition-colors ${isActive ? 'bg-blue-500 text-white hover:bg-blue-600 hover:text-blue-500' : ''}`}
            >
                {children}
            </button>
        );
    }
    return (
        <Link 
            to={to} 
            className={`block px-4 py-2 text-gray-700 hover:bg-blue-100 hover:text-blue-600 rounded-md transition-colors ${isActive ? 'bg-blue-500 text-white hover:bg-blue-600 hover:text-blue-500' : ''}`} 
        >
            {children}
        </Link>
    );
};

const StatCard = ({ title, value, icon, color = 'blue' }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4">
        <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
            {icon}
        </div>
        <div>
            <p className="text-gray-500 text-sm">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const SellerDashboardPage = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const navigate = useNavigate();
    const location = useLocation(); // Added to determine if we are on the base seller dashboard path

    // Placeholder data - replace with API call and context
    const stats = {
        totalListings: 25,
        activeListings: 18,
        pendingOrders: 3,
        totalRevenue: '$5,875.50'
    };

    const recentActivities = [
        { id: 1, type: 'new_order', text: 'New order #ORD10024 received for "Refurbished iPhone 12".', time: '2 hours ago' },
        { id: 2, type: 'new_listing', text: 'You listed "Grade A MacBook Pro 15 inch".', time: '5 hours ago' },
        { id: 3, type: 'review', text: 'Customer left a 5-star review on "Samsung Galaxy S21 Refurbished".', time: '1 day ago' },
    ];

    const handleLogout = () => {
        // Call logout from AuthContext
        console.log('Seller logged out');
        navigate('/auth');
    };

    const renderOverviewContent = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Listings" value={stats.totalListings} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>} />
                <StatCard title="Active Listings" value={stats.activeListings} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M3 7l9-4 9 4M3 7h18M5 7h2m10 0h2" /></svg>} color="green" />
                <StatCard title="Pending Orders" value={stats.pendingOrders} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} color="yellow" />
                <StatCard title="Total Revenue (Month)" value={stats.totalRevenue} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} color="purple" />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
                <ul className="space-y-3">
                    {recentActivities.map(activity => (
                        <li key={activity.id} className="flex items-start p-3 border-b last:border-b-0">
                            <div className={`p-2 rounded-full mr-3 ${activity.type === 'new_order' ? 'bg-blue-100' : activity.type === 'new_listing' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                                {activity.type === 'new_order' && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
                                {activity.type === 'new_listing' && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                                {activity.type === 'review' && <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.846 5.671a1 1 0 00.95.69h5.969c.969 0 1.371 1.24.588 1.81l-4.823 3.522a1 1 0 00-.364 1.118l1.846 5.671c.3.921-.755 1.688-1.539 1.118l-4.823-3.522a1 1 0 00-1.176 0l-4.823 3.522c-.783.57-1.838-.197-1.539-1.118l1.846-5.671a1 1 0 00-.364-1.118L2.05 11.098c-.783-.57-.38-1.81.588-1.81h5.969a1 1 0 00.95-.69L11.049 2.927z" /></svg>}
                            </div>
                            <div>
                                <p className="text-sm text-gray-700">{activity.text}</p>
                                <p className="text-xs text-gray-500">{activity.time}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row gap-8">
                <aside className="w-full md:w-1/4">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-['Poppins'] font-bold mb-4">Seller Portal</h2>
                        <nav className="space-y-1">
                            <DashboardNavLink to="/dashboard/seller" action={() => navigate('/dashboard/seller')}>Dashboard Overview</DashboardNavLink>
                            <DashboardNavLink to="/dashboard/seller/products" action={() => navigate('/dashboard/seller/products')}>My Listings</DashboardNavLink>
                            <DashboardNavLink to="/dashboard/seller/products/new" action={() => navigate('/dashboard/seller/products/new')}>Add New Product</DashboardNavLink>
                            {/* <DashboardNavLink to="/dashboard/seller/orders" action={() => setActiveTab('orders')}>Orders</DashboardNavLink> */}
                            {/* <DashboardNavLink to="/dashboard/seller/settings" action={() => setActiveTab('settings')}>Settings</DashboardNavLink> */}
                            <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-100 hover:text-red-600 rounded-md transition-colors mt-4">Logout</button>
                        </nav>
                    </div>
                </aside>
                <main className="w-full md:w-3/4">
                  { location.pathname === '/dashboard/seller' ? renderOverviewContent() : <Outlet /> }
                </main>
            </div>
        </div>
    );
};

export default SellerDashboardPage;
