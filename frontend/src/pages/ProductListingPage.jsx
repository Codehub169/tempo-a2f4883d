import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Placeholder data - replace with API call and context
const allProducts = [
  {
    id: '5',
    name: 'Energy Star Fridge - Refurbished',
    condition: 'Excellent',
    price: '399.00',
    imageUrl: 'https://placehold.co/600x400/007BFF/white?text=Fridge+Model+A',
    altText: 'Refurbished Fridge A',
    category: 'fridges',
    seller: 'EcoAppliances'
  },
  {
    id: '6',
    name: '55" 4K Smart TV - Grade A',
    condition: 'Like New',
    price: '320.00',
    imageUrl: 'https://placehold.co/600x400/28A745/white?text=Smart+TV+55inch',
    altText: 'Refurbished Smart TV',
    category: 'tv',
    seller: 'TechSavers'
  },
  {
    id: '7',
    name: 'Mobile Phone Pro - Certified',
    condition: 'Good',
    price: '250.00',
    imageUrl: 'https://placehold.co/600x400/FFC107/black?text=Mobile+Phone+Pro',
    altText: 'Refurbished Mobile Pro',
    category: 'mobiles',
    seller: 'GadgetRenew'
  },
  {
    id: '8',
    name: 'Slim Laptop 13" - Excellent',
    condition: 'Excellent',
    price: '499.99',
    imageUrl: 'https://placehold.co/600x400/6C757D/white?text=Laptop+Slim',
    altText: 'Refurbished Laptop Slim',
    category: 'laptops',
    seller: 'PC_Revive'
  },
  // Add more products for pagination and filtering demonstration
    {
    id: '9',
    name: 'Gaming Laptop Beast - Good',
    condition: 'Good',
    price: '750.00',
    imageUrl: 'https://placehold.co/600x400/DC3545/white?text=Gaming+Laptop',
    altText: 'Refurbished Gaming Laptop',
    category: 'laptops',
    seller: 'GameTech'
  },
  {
    id: '10',
    name: 'Compact Microwave - Like New',
    condition: 'Like New',
    price: '89.00',
    imageUrl: 'https://placehold.co/600x400/17A2B8/white?text=Microwave',
    altText: 'Refurbished Microwave',
    category: 'appliances', // New category for demo
    seller: 'KitchenWiz'
  }
];

const categories = [
    { id: 'tv', name: 'TVs' },
    { id: 'fridges', name: 'Refrigerators' },
    { id: 'mobiles', name: 'Mobile Phones' },
    { id: 'laptops', name: 'Laptops' },
    { id: 'appliances', name: 'Appliances' }
];

const conditions = [
    { id: 'new', name: 'Like New' },
    { id: 'excellent', name: 'Excellent' },
    { id: 'good', name: 'Good' }
];

function ProductListingPage() {
  const location = useLocation();
  const [products, setProducts] = useState(allProducts);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCondition, setSelectedCondition] = useState('');
  const [priceRange, setPriceRange] = useState(1000);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    }
  }, [location.search]);

  // Basic filtering logic (can be expanded)
  useEffect(() => {
    let filtered = allProducts;
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category));
    }
    if (selectedCondition) {
      filtered = filtered.filter(p => p.condition.toLowerCase().replace(' ', '') === selectedCondition);
    }
    filtered = filtered.filter(p => parseFloat(p.price) <= priceRange);
    setProducts(filtered);
  }, [selectedCategories, selectedCondition, priceRange]);

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setSelectedCategories(prev => 
      checked ? [...prev, value] : prev.filter(cat => cat !== value)
    );
  };

  const handleConditionChange = (e) => {
    setSelectedCondition(e.target.value);
  };

  const handlePriceChange = (e) => {
    setPriceRange(parseInt(e.target.value));
  };
  
  // TODO: Implement actual filter application and sorting
  const applyFilters = () => {
    // This is mostly handled by useEffect now, but a button could trigger a more complex query
    console.log('Applying filters:', { selectedCategories, selectedCondition, priceRange });
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-1/4">
          <div className="bg-white p-6 rounded-lg shadow-lg sticky top-24">
            <h2 className="text-2xl font-['Poppins'] font-bold mb-6">Filters</h2>
            
            <div className="mb-6">
              <legend className="text-lg font-['Poppins'] font-semibold mb-2">Category</legend>
              {categories.map(cat => (
                <label key={cat.id} className="block text-sm text-gray-700 mb-1 font-['Inter']">
                  <input 
                    type="checkbox" 
                    name="category" 
                    value={cat.id} 
                    className="mr-2 accent-[#007BFF]"
                    checked={selectedCategories.includes(cat.id)}
                    onChange={handleCategoryChange}
                  /> {cat.name}
                </label>
              ))}
            </div>

            <div className="mb-6">
              <legend className="text-lg font-['Poppins'] font-semibold mb-2">Condition</legend>
              {conditions.map(cond => (
                <label key={cond.id} className="block text-sm text-gray-700 mb-1 font-['Inter']">
                  <input 
                    type="radio" 
                    name="condition" 
                    value={cond.id} 
                    className="mr-2 accent-[#007BFF]"
                    checked={selectedCondition === cond.id}
                    onChange={handleConditionChange}
                  /> {cond.name}
                </label>
              ))}
            </div>

            <div className="mb-6">
              <legend className="text-lg font-['Poppins'] font-semibold mb-2">Price Range</legend>
              <input 
                type="range" 
                min="0" 
                max="1000" 
                value={priceRange}
                onChange={handlePriceChange}
                className="w-full accent-[#007BFF] h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-600 font-['Inter']">
                <span>$0</span>
                <span>${priceRange}</span>
                <span>$1000</span>
              </div>
            </div>

            <button 
              onClick={applyFilters} 
              className="w-full bg-[#007BFF] hover:bg-[#0056b3] text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out font-['Inter']"
            >
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Product Grid */}
        <section className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-['Poppins'] font-bold">Refurbished Products</h1>
            <select className="border border-gray-300 rounded-md p-2 font-['Inter']">
              <option>Sort by: Relevance</option>
              <option>Sort by: Price Low to High</option>
              <option>Sort by: Price High to Low</option>
              <option>Sort by: Newest Arrivals</option>
            </select>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                  <Link to={`/products/${product.id}`}>
                    <img src={product.imageUrl} alt={product.altText} className="w-full h-48 object-cover" />
                    <div className="p-6">
                      <h3 className="text-xl font-['Poppins'] font-semibold mb-2">{product.name}</h3>
                      <p className="text-gray-600 mb-1 font-['Inter']">Condition: {product.condition}</p>
                      <p className="text-xs text-gray-500 mb-1 font-['Inter']">Sold by: {product.seller}</p>
                      <p className="text-lg font-bold text-[#007BFF] mb-3 font-['Inter']">${product.price}</p>
                      <button className="w-full bg-[#28A745] hover:bg-[#218838] text-white font-semibold py-2 px-4 rounded-lg shadow-md font-['Inter']">
                        View Details
                      </button>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 font-['Inter'] text-lg">No products found matching your criteria.</p>
          )}

          {/* Pagination - Basic structure */}
          <div className="mt-12 flex justify-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px font-['Inter']" aria-label="Pagination">
              <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Previous
              </a>
              <a href="#" aria-current="page" className="z-10 bg-blue-50 border-[#007BFF] text-[#007BFF] relative inline-flex items-center px-4 py-2 border text-sm font-medium"> 1 </a>
              <a href="#" className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"> 2 </a>
              <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Next
              </a>
            </nav>
          </div>
        </section>
      </div>
    </main>
  );
}

export default ProductListingPage;
