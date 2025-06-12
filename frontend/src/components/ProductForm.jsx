import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ProductForm = ({ initialData, onSubmit, isLoading, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    condition: 'Good', // Default condition
    images: [], // For storing file objects or URLs
    imagePreviews: [], // For displaying image previews
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        category: initialData.category || '',
        price: initialData.price?.toString() || '',
        stock: initialData.stock?.toString() || '',
        condition: initialData.condition || 'Good',
        images: initialData.images || [], // Assuming images are URLs if editing
        imagePreviews: initialData.images || [], // Show existing images
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...formData.images, ...files];
    const newPreviews = [...formData.imagePreviews];

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        setFormData(prev => ({ ...prev, images: newImages, imagePreviews: [...newPreviews] })); 
      };
      reader.readAsDataURL(file);
    });
    // If no new files, ensure state updates correctly
    if (files.length === 0) {
        setFormData(prev => ({ ...prev, images: newImages, imagePreviews: newPreviews }));
    }
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = formData.imagePreviews.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages, imagePreviews: newPreviews }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert price and stock to numbers before submitting
    const submissionData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
      // Actual image file handling/upload logic would be in onSubmit
    };
    onSubmit(submissionData);
  };

  const categories = ['TVs', 'Refrigerators', 'Mobile Phones', 'Laptops', 'Tablets', 'Audio', 'Gaming Consoles', 'Other Electronics'];
  const conditions = ['Like New', 'Excellent', 'Good', 'Fair', 'Acceptable'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 md:p-8 rounded-lg shadow-xl">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows="4" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select name="category" id="category" value={formData.category} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white">
            <option value="" disabled>Select category</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
          <select name="condition" id="condition" value={formData.condition} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white">
            {conditions.map(cond => <option key={cond} value={cond}>{cond}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
          <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
          <input type="number" name="stock" id="stock" value={formData.stock} onChange={handleChange} required min="0" step="1" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
      </div>

      <div>
        <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
        <input type="file" name="images" id="images" onChange={handleImageChange} multiple accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
        {formData.imagePreviews.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {formData.imagePreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-md shadow-sm" />
                <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs opacity-75 group-hover:opacity-100 transition-opacity">
                  X
                </button>
              </div>
            ))}
          </div>
        )}
        <p className="mt-1 text-xs text-gray-500">Upload one or more images (JPG, PNG, GIF). Max 5MB per image.</p>
      </div>

      <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200 mt-8">
        {onCancel && (
            <button type="button" onClick={onCancel} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-sm transition-all duration-300 ease-in-out">
                Cancel
            </button>
        )}
        <button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300 ease-in-out disabled:opacity-50">
          {isLoading ? (initialData ? 'Updating...' : 'Adding...') : (initialData ? 'Update Product' : 'Add Product')}
        </button>
      </div>
    </form>
  );
};

ProductForm.propTypes = {
  initialData: PropTypes.object, // For editing existing product
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  onCancel: PropTypes.func, // Optional cancel handler
};

ProductForm.defaultProps = {
  isLoading: false,
  initialData: null,
};

export default ProductForm;
