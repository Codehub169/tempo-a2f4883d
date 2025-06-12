import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const SellerProductListItem = ({ product, onEdit, onDelete }) => {
  if (!product) {
    return (
      <tr className="border-b border-gray-200 hover:bg-gray-50">
        <td colSpan="7" className="py-4 px-6 text-center text-gray-500">Product data not available.</td>
      </tr>
    );
  }

  const { id, name, images, stock, status, price, category } = product;
  const imageUrl = images && images.length > 0 ? images[0] : 'https://placehold.co/100x100/E9ECEF/343A40?text=No+Image';

  const getStatusClass = (currentStatus) => {
    switch (currentStatus?.toLowerCase()) {
      case 'active':
      case 'in stock':
        return 'bg-green-100 text-green-700';
      case 'inactive':
      case 'out of stock':
        return 'bg-red-100 text-red-700';
      case 'pending review':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
      <td className="py-3 px-4">
        <img src={imageUrl} alt={name} className="h-16 w-16 object-cover rounded-md shadow-sm" />
      </td>
      <td className="py-3 px-4">
        <Link to={`/products/${id}`} className="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors">
          {name}
        </Link>
        <p className="text-xs text-gray-500">ID: {id}</p>
        <p className="text-xs text-gray-500 capitalize">Category: {category || 'N/A'}</p>
      </td>
      <td className="py-3 px-4 text-sm text-gray-600">{stock}</td>
      <td className="py-3 px-4">
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(status)}`}>
          {status || 'Unknown'}
        </span>
      </td>
      <td className="py-3 px-4 text-sm font-semibold text-gray-800">${price?.toFixed(2)}</td>
      <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
        <button 
          onClick={() => onEdit(id)}
          className="text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors duration-150"
        >
          Edit
        </button>
        <button 
          onClick={() => onDelete(id)}
          className="text-xs font-medium text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors duration-150"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

SellerProductListItem.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.string),
    stock: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    category: PropTypes.string,
  }),
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default SellerProductListItem;
