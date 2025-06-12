import express from 'express';
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getSellerProducts
} from '../controllers/product.controller.js'; // Controller to be implemented
import authenticateToken from '../middleware/authenticateToken.js'; // Middleware to be implemented
// import { checkRole } from '../middleware/checkRole.js'; // Optional: Middleware for role checks (e.g., seller)

const router = express.Router();

// @route   GET api/products
// @desc    Get all products (public, with filtering/sorting/pagination)
// @access  Public
router.get('/', getAllProducts);

// @route   GET api/products/seller
// @desc    Get all products for the authenticated seller
// @access  Private (Seller)
router.get('/seller', authenticateToken, /* checkRole(['seller']), */ getSellerProducts); // Assuming checkRole middleware for seller specific access

// @route   GET api/products/:id
// @desc    Get a single product by ID
// @access  Public
router.get('/:id', getProductById);

// @route   POST api/products
// @desc    Create a new product
// @access  Private (Seller)
router.post('/', authenticateToken, /* checkRole(['seller']), */ createProduct);

// @route   PUT api/products/:id
// @desc    Update a product by ID
// @access  Private (Seller, owner)
router.put('/:id', authenticateToken, /* checkRole(['seller']), */ updateProduct);

// @route   DELETE api/products/:id
// @desc    Delete a product by ID
// @access  Private (Seller, owner)
router.delete('/:id', authenticateToken, /* checkRole(['seller']), */ deleteProduct);

export default router;
