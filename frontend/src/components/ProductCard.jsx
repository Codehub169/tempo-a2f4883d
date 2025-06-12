import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  if (!product) {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col h-full animate-pulse">
        <div className="w-full h-48 bg-gray-300"></div>
        <div className="p-6 flex flex-col flex-grow">
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-1"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-1"></div>
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-3 mt-auto"></div>
          <div className="h-10 bg-gray-300 rounded w-full mt-auto"></div>
        </div>
      </div>
    );
  }

  const { id, name, images, condition, price, seller } = product;
  const imageUrl = images && images.length > 0 && images[0] ? images[0] : `https://placehold.co/600x400/E9ECEF/343A40?text=${encodeURIComponent(name)}`;

  let conditionBadgeColor = 'bg-gray-200 text-gray-800';
  let conditionText = condition || 'N/A';

  if (condition) {
    const lowerCaseCondition = String(condition).toLowerCase();
    if (lowerCaseCondition.includes('like new') || lowerCaseCondition.includes('new')) {
      conditionBadgeColor = 'bg-green-100 text-green-800';
      conditionText = 'Like New';
    } else if (lowerCaseCondition.includes('excellent')) {
      conditionBadgeColor = 'bg-blue-100 text-blue-800'; 
      conditionText = 'Excellent';
    } else if (lowerCaseCondition.includes('good')) {
      conditionBadgeColor = 'bg-yellow-100 text-yellow-800';
      conditionText = 'Good';
    } else {
      conditionText = condition; // Keep original if not matched
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col h-full">
      <Link to={`/products/${id}`} className="flex flex-col h-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#007BFF] rounded-lg">
        <div className="relative w-full h-48">
            <img 
              src={imageUrl} 
              alt={name} 
              className="w-full h-full object-cover" 
              onError={(e) => { 
                e.target.onerror = null; 
                e.target.src=`https://placehold.co/600x400/E9ECEF/343A40?text=Not+Available`; 
              }}
            />
        </div>
        <div className="p-4 md:p-6 flex flex-col flex-grow">
          <h3 className="text-lg md:text-xl font-semibold mb-1 md:mb-2 truncate" title={name}>{name}</h3>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block mb-1 md:mb-2 self-start ${conditionBadgeColor}`}>
            {conditionText}
          </span>
          {seller && seller.name && <p className="text-xs text-gray-500 mb-1 md:mb-2 truncate">Sold by: {seller.name}</p>}
          <p className="text-xl md:text-2xl font-bold text-[#007BFF] mb-2 md:mb-3 mt-auto">${parseFloat(price).toFixed(2)}</p>
          <button 
            tabIndex="-1" // To ensure the card link is the primary focus target
            className="w-full bg-[#28A745] hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out mt-auto text-sm md:text-base">
            View Details
          </button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
