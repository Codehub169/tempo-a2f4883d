import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// Placeholder product data - replace with API call / context
const productsData = {
  '1': {
    id: '1',
    name: 'Smart TV 4K - Refurbished',
    condition: 'Excellent',
    price: '299.99',
    originalPrice: '499.00',
    seller: 'TechReborn',
    description: 'This Smart TV 4K has been professionally refurbished to an excellent condition. Enjoy stunning visuals and smart features at a fraction of the cost. Comes with a 90-day warranty.',
    images: [
      'https://placehold.co/600x600/007BFF/white?text=Smart+TV+Main',
      'https://placehold.co/600x600/007BFF/white?text=Smart+TV+Angle+1',
      'https://placehold.co/600x600/007BFF/white?text=Smart+TV+Back',
      'https://placehold.co/600x600/007BFF/white?text=Smart+TV+Remote'
    ],
    thumbnails: [
      'https://placehold.co/150x150/007BFF/white?text=TV+1',
      'https://placehold.co/150x150/007BFF/white?text=TV+2',
      'https://placehold.co/150x150/007BFF/white?text=TV+3',
      'https://placehold.co/150x150/007BFF/white?text=TV+4'
    ],
    specifications: [
      { label: 'Screen Size', value: '55 inches' },
      { label: 'Resolution', value: '4K UHD (3840 x 2160)' },
      { label: 'Refresh Rate', value: '60Hz' },
      { label: 'Smart Features', value: 'Yes, WebOS' },
      { label: 'Condition Grade', value: 'Excellent' }
    ],
    warranty: '90-day limited warranty covering parts and labor. Extended warranty options available.',
    returns: '30-day return policy. Item must be in original condition. Buyer may pay return shipping.',
    sellerInfo: {
      name: 'TechReborn',
      rating: '4.7/5 Stars (150+ reviews)',
      profileLink: '#'
    }
  },
  '5': { // Matching ID from PLP example
    id: '5',
    name: 'Energy Star Fridge - Refurbished',
    condition: 'Excellent',
    price: '399.00',
    originalPrice: '599.00',
    seller: 'EcoAppliances',
    description: 'This high-quality Energy Star certified refrigerator has been professionally refurbished to an excellent condition. It offers spacious storage, modern features, and significant energy savings. Perfect for families or anyone looking for a reliable appliance at a great price.',
    images: [
      'https://placehold.co/600x600/007BFF/white?text=Fridge+Main',
      'https://placehold.co/600x600/007BFF/white?text=Fridge+Open',
      'https://placehold.co/600x600/007BFF/white?text=Fridge+Detail',
      'https://placehold.co/600x600/007BFF/white?text=Fridge+Energy+Star'
    ],
    thumbnails: [
      'https://placehold.co/150x150/007BFF/white?text=Fridge+1',
      'https://placehold.co/150x150/007BFF/white?text=Fridge+2',
      'https://placehold.co/150x150/007BFF/white?text=Fridge+3',
      'https://placehold.co/150x150/007BFF/white?text=Fridge+4'
    ],
    specifications: [
        { label: 'Model', value: 'RFG-2000X' },
        { label: 'Capacity', value: '20 Cubic Feet' },
        { label: 'Dimensions', value: '68" H x 30" W x 32" D' },
        { label: 'Energy Star Certified', value: 'Yes' },
        { label: 'Color', value: 'Stainless Steel' },
        { label: 'Refurbishment Grade', value: 'Excellent' }
    ],
    warranty: 'This product comes with a 90-day limited warranty covering parts and labor for functional defects. For full warranty details, please see our warranty page.',
    returns: 'We offer a 30-day return policy for this item. If you are not satisfied with your purchase, you can return it within 30 days for a full refund or exchange, subject to our return conditions. Buyer may be responsible for return shipping costs.',
    sellerInfo: {
        name: 'EcoAppliances',
        rating: '4.8/5 Stars (based on 250+ reviews)',
        profileLink: '#'
    }
  }
  // Add other products as needed, matching IDs from PLP/Homepage
};

function ProductDetailsPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [mainImage, setMainImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Simulate fetching product data
    const fetchedProduct = productsData[productId];
    if (fetchedProduct) {
      setProduct(fetchedProduct);
      setMainImage(fetchedProduct.images[0]);
    } else {
      // Handle product not found, e.g., redirect or show error
      console.error('Product not found');
    }
  }, [productId]);

  const handleThumbnailClick = (imageSrc) => {
    setMainImage(imageSrc);
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1) {
        setQuantity(value);
    }
  };
  
  const handleAddToCart = () => {
    // TODO: Implement Add to Cart logic using CartContext
    console.log(`Added ${quantity} of ${product.name} (ID: ${product.id}) to cart.`);
  };

  if (!product) {
    return <div className="container mx-auto px-4 py-12 text-center font-['Inter']">Loading product details...</div>; // Or a more sophisticated loading state
  }

  const conditionBadgeColor = () => {
    switch (product.condition.toLowerCase()) {
      case 'like new': return 'bg-green-100 text-green-700';
      case 'excellent': return 'bg-yellow-100 text-yellow-700'; // Adjusted from HTML for better contrast
      case 'good': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Image Gallery */}
          <div className="w-full md:w-1/2">
            <img id="mainProductImage" src={mainImage} alt={`Main view of ${product.name}`} className="w-full h-auto rounded-lg shadow-md object-cover max-h-[500px]" />
            <div className="grid grid-cols-4 gap-2 mt-4">
              {product.thumbnails.map((thumb, index) => (
                <img 
                  key={index} 
                  src={thumb} 
                  alt={`Thumbnail ${index + 1} for ${product.name}`} 
                  className={`cursor-pointer rounded-md border-2 hover:border-[#007BFF] ${mainImage === product.images[index] ? 'border-[#007BFF] ring-2 ring-[#007BFF]' : 'border-transparent'}`}
                  onClick={() => handleThumbnailClick(product.images[index])}
                />
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="w-full md:w-1/2 font-['Inter']">
            <h1 className="text-3xl md:text-4xl font-['Poppins'] font-bold mb-3">{product.name}</h1>
            <div className="flex items-center mb-4">
              <span className={`text-sm font-semibold px-3 py-1 rounded-full mr-2 ${conditionBadgeColor()}`}>
                Condition: {product.condition}
              </span>
              <span className="text-sm text-gray-600">Sold by: <Link to={product.sellerInfo.profileLink} className="text-[#007BFF] hover:underline">{product.sellerInfo.name}</Link></span>
            </div>
            <p className="text-3xl font-bold text-[#007BFF] mb-6">
              ${product.price} 
              {product.originalPrice && <span className="text-lg text-gray-500 line-through ml-2">${product.originalPrice}</span>}
            </p>
            
            <p className="text-gray-700 mb-6 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center mb-6">
              <label htmlFor="quantity" className="mr-3 font-semibold">Quantity:</label>
              <input 
                type="number" 
                id="quantity" 
                name="quantity" 
                value={quantity}
                onChange={handleQuantityChange}
                min="1" 
                className="w-20 p-2 border border-gray-300 rounded-md text-center focus:ring-1 focus:ring-[#007BFF] focus:border-[#007BFF]"
              />
            </div>

            <button 
              onClick={handleAddToCart}
              className="w-full bg-[#28A745] hover:bg-[#218838] text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 ease-in-out text-lg mb-4 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Add to Cart
            </button>
            {/* Buy Now button can be added here if needed */}
            {/* <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 ease-in-out text-lg">Buy Now</button> */}
          </div>
        </div>

        {/* Tabs for Description, Specs, Warranty, etc. */}
        <div className="mt-12 font-['Inter']">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {['description', 'specs', 'warranty', 'seller'].map(tabName => (
                <button 
                  key={tabName}
                  onClick={() => handleTabClick(tabName)}
                  className={`py-2 px-4 font-medium text-gray-600 border-b-2 focus:outline-none capitalize hover:border-[#007BFF] hover:text-[#007BFF] ${activeTab === tabName ? 'border-[#007BFF] text-[#007BFF]' : 'border-transparent'}`}
                >
                  {tabName === 'specs' ? 'Specifications' : tabName.replace('-', ' ')}
                </button>
              ))}
            </nav>
          </div>
          <div className="mt-6">
            {activeTab === 'description' && (
              <div>
                <h3 className="text-xl font-['Poppins'] font-semibold mb-2">Detailed Product Description</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>
            )}
            {activeTab === 'specs' && (
              <div>
                <h3 className="text-xl font-['Poppins'] font-semibold mb-2">Technical Specifications</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {product.specifications.map(spec => (
                    <li key={spec.label}><strong>{spec.label}:</strong> {spec.value}</li>
                  ))}
                </ul>
              </div>
            )}
            {activeTab === 'warranty' && (
              <div>
                <h3 className="text-xl font-['Poppins'] font-semibold mb-2">Warranty & Return Policy</h3>
                <h4 className="font-['Poppins'] font-semibold mt-4 mb-1">Warranty</h4>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{product.warranty}</p>
                <h4 className="font-['Poppins'] font-semibold mt-4 mb-1">Returns</h4>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{product.returns}</p>
              </div>
            )}
            {activeTab === 'seller' && (
              <div>
                <h3 className="text-xl font-['Poppins'] font-semibold mb-2">About the Seller: {product.sellerInfo.name}</h3>
                <p className="text-gray-700 leading-relaxed mb-2">
                  {/* Placeholder seller description - to be fetched or part of product data */}
                  {product.sellerInfo.name} specializes in professionally refurbishing and reselling high-quality electronics. We are committed to sustainability and providing our customers with reliable products at affordable prices.
                </p>
                <p className="text-gray-700"><strong>Seller Rating:</strong> {product.sellerInfo.rating}</p>
                <Link to={product.sellerInfo.profileLink} className="text-[#007BFF] hover:underline font-semibold">
                  View all products from {product.sellerInfo.name}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetailsPage;
