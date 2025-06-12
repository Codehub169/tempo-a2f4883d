import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ProductListItem = ({ product, onEdit, onDelete }) => (
    <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-4">
            <img src={product.imageUrl || 'https://placehold.co/80x80/E9ECEF/343A40?text=No+Image'} alt={product.name} className="w-16 h-16 object-cover rounded"/>
            <div>
                <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                <p className="text-sm text-gray-500">ID: {product.id} | Stock: {product.stock}</p>
                <p className={`text-sm font-medium ${product.status === 'Active' ? 'text-green-600' : 'text-yellow-600'}`}>{product.status}</p>
            </div>
        </div>
        <div className="text-lg font-semibold text-[#007BFF]">${product.price.toFixed(2)}</div>
        <div className="space-x-2">
            <button 
                onClick={() => onEdit(product.id)} 
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors"
            >
                Edit
            </button>
            <button 
                onClick={() => onDelete(product.id)} 
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors"
            >
                Delete
            </button>
        </div>
    </div>
);

const SellerProductManagementPage = () => {
    const navigate = useNavigate();
    // Placeholder data - replace with API call and context
    const [products, setProducts] = useState([
        {
            id: 'PROD001',
            name: 'Refurbished Smartphone Model X',
            category: 'Mobile Phones',
            price: 299.99,
            stock: 15,
            status: 'Active',
            imageUrl: 'https://placehold.co/600x400/FFC107/black?text=Mobile+X'
        },
        {
            id: 'PROD002',
            name: 'Grade A Laptop Pro 15 inch',
            category: 'Laptops',
            price: 750.00,
            stock: 8,
            status: 'Active',
            imageUrl: 'https://placehold.co/600x400/6C757D/white?text=Laptop+Pro'
        },
        {
            id: 'PROD003',
            name: 'Smart TV 4K 55 inch - Refurbished',
            category: 'TVs',
            price: 420.50,
            stock: 0,
            status: 'Inactive (Out of Stock)',
            imageUrl: 'https://placehold.co/600x400/007BFF/white?text=Smart+TV'
        },
    ]);

    const handleEditProduct = (productId) => {
        console.log('Edit product:', productId);
        // Navigate to edit product page, e.g., navigate(`/dashboard/seller/products/edit/${productId}`);
        // For now, this will be a placeholder for ProductForm component integration
        alert(`Edit functionality for product ${productId} to be implemented. This would typically navigate to a form page.`);
    };

    const handleDeleteProduct = (productId) => {
        if (window.confirm(`Are you sure you want to delete product ${productId}?`)) {
            setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
            console.log('Delete product:', productId);
            // Call API to delete product
        }
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Product Listings</h1>
                <Link 
                    to="/dashboard/seller/products/new" 
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-colors text-lg inline-flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    Add New Product
                </Link>
            </div>

            {products.length > 0 ? (
                <div className="space-y-4">
                    {products.map(product => (
                        <ProductListItem 
                            key={product.id} 
                            product={product} 
                            onEdit={handleEditProduct}
                            onDelete={handleDeleteProduct}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No products found</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by adding your first product.</p>
                    <div className="mt-6">
                        <Link 
                            to="/dashboard/seller/products/new" 
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors"
                        >
                            Add Product
                        </Link>
                    </div>
                </div>
            )}
            
            {/* Pagination Placeholder (if many products) */}
            {products.length > 5 && (
                 <div className="mt-12 flex justify-center">
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                          Previous
                        </a>
                        <a href="#" aria-current="page" className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"> 1 </a>
                        <a href="#" className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"> 2 </a>
                        <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                          Next
                        </a>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default SellerProductManagementPage;
