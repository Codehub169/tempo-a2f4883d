import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const OrderHistoryItem = ({ order }) => {
  if (!order) {
    return (
      <tr className="border-b border-gray-200 hover:bg-gray-50">
        <td colSpan="5" className="py-4 px-6 text-center text-gray-500">Order data not available.</td>
      </tr>
    );
  }

  const { id, date, total, status, items } = order;

  const getStatusClass = (currentStatus) => {
    switch (currentStatus.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'shipped':
        return 'bg-blue-100 text-blue-700';
      case 'processing':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
      <td className="py-4 px-6 text-sm text-gray-700 whitespace-nowrap">
        <Link to={`/dashboard/user/orders/${id}`} className="primary-text hover:underline font-medium">
          #{id}
        </Link>
      </td>
      <td className="py-4 px-6 text-sm text-gray-600 whitespace-nowrap">{new Date(date).toLocaleDateString()}</td>
      <td className="py-4 px-6 text-sm text-gray-600">
        {items && items.length > 0 ? (
          <ul className="list-disc list-inside text-xs">
            {items.slice(0, 2).map(item => (
              <li key={item.id}>{item.name} (x{item.quantity})</li>
            ))}
            {items.length > 2 && <li>...and {items.length - 2} more</li>}
          </ul>
        ) : 'N/A'}
      </td>
      <td className="py-4 px-6 text-sm text-gray-800 font-semibold whitespace-nowrap">
        ${total.toFixed(2)}
      </td>
      <td className="py-4 px-6 whitespace-nowrap">
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(status)}`}>
          {status}
        </span>
      </td>
      <td className="py-4 px-6 text-right whitespace-nowrap">
        <Link 
          to={`/dashboard/user/orders/${id}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-150 py-1 px-3 rounded-md hover:bg-blue-50"
        >
          View Details
        </Link>
      </td>
    </tr>
  );
};

OrderHistoryItem.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
    })),
  }),
};

export default OrderHistoryItem;
