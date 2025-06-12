import React from 'react';
import { Link } from 'react-router-dom';

const featuredProductsData = [
  {
    id: '1',
    name: 'Smart TV 4K - Refurbished',
    condition: 'Excellent',
    price: '299.99',
    imageUrl: 'https://placehold.co/600x400/007BFF/white?text=Refurbished+TV',
    altText: 'Refurbished TV'
  },
  {
    id: '2',
    name: 'Double Door Fridge - Grade A',
    condition: 'Like New',
    price: '450.00',
    imageUrl: 'https://placehold.co/600x400/28A745/white?text=Refurbished+Fridge',
    altText: 'Refurbished Fridge'
  },
  {
    id: '3',
    name: 'Smartphone XYZ - Certified Refurbished',
    condition: 'Good',
    price: '199.00',
    imageUrl: 'https://placehold.co/600x400/FFC107/black?text=Refurbished+Mobile',
    altText: 'Refurbished Mobile'
  },
  {
    id: '4',
    name: 'Ultrabook Pro - Seller Refurbished',
    condition: 'Excellent',
    price: '599.50',
    imageUrl: 'https://placehold.co/600x400/6C757D/white?text=Refurbished+Laptop',
    altText: 'Refurbished Laptop'
  }
];

const categoriesData = [
  {
    name: 'TVs',
    slug: 'tv',
    imageUrl: 'https://placehold.co/100x100/007BFF/white?text=TVs'
  },
  {
    name: 'Refrigerators',
    slug: 'fridges',
    imageUrl: 'https://placehold.co/100x100/28A745/white?text=Fridges'
  },
  {
    name: 'Mobile Phones',
    slug: 'mobiles',
    imageUrl: 'https://placehold.co/100x100/FFC107/black?text=Mobiles'
  },
  {
    name: 'Laptops',
    slug: 'laptops',
    imageUrl: 'https://placehold.co/100x100/6C757D/white?text=Laptops'
  }
];

const whyChooseUsData = [
  {
    title: 'Verified Quality',
    description: 'All products are thoroughly inspected and certified, ensuring they meet high quality standards. Clear condition grading for full transparency.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    )
  },
  {
    title: 'Great Value',
    description: 'Enjoy significant savings on top-brand electronics without compromising on performance or reliability. Smart shopping starts here.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    )
  },
  {
    title: 'Trusted Sellers & Buyers',
    description: 'A secure platform for both buyers and sellers. We foster a community built on trust and fair dealings for refurbished goods.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m0-6H7.8C6.806 6 6 6.806 6 7.8v8.4C6 17.194 6.806 18 7.8 18h8.4c.994 0 1.8-.806 1.8-1.8V12M9 12h6" /></svg>
    )
  }
];

function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#007BFF] text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-['Poppins'] font-bold mb-4">Quality Refurbished Electronics</h1>
          <p className="text-xl mb-8 font-['Inter']">Get like-new devices at unbeatable prices. Trusted quality, guaranteed.</p>
          <Link 
            to="/products" 
            className="bg-white text-[#007BFF] font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 transition-colors text-lg font-['Inter']"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-['Poppins'] font-bold text-center mb-12">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProductsData.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                <Link to={`/products/${product.id}`}>
                  <img src={product.imageUrl} alt={product.altText} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-['Poppins'] font-semibold mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-1 font-['Inter']">Condition: {product.condition}</p>
                    <p className="text-lg font-bold text-[#007BFF] mb-3 font-['Inter']">${product.price}</p>
                    <button className="w-full bg-[#28A745] hover:bg-[#218838] text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out font-['Inter']">
                      View Details
                    </button>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="bg-[#F8F9FA] py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-['Poppins'] font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categoriesData.map(category => (
              <Link 
                key={category.slug} 
                to={`/products?category=${category.slug}`} 
                className="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow text-center"
              >
                <img src={category.imageUrl} alt={category.name} className="mx-auto mb-4 h-16 w-16" />
                <h3 className="text-xl font-['Poppins'] font-semibold">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-us" className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-['Poppins'] font-bold text-center mb-12">Why Choose ReNew Marketplace?</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {whyChooseUsData.map(item => (
              <div key={item.title} className="p-6">
                <div className="bg-[#28A745] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl">
                  {item.icon}
                </div>
                <h3 className="text-xl font-['Poppins'] font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 font-['Inter']">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
