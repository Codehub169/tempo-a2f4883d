import express from 'express';
import {
  getCart,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} from '../controllers/cart.controller.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();

// All cart routes are protected and require a user to be logged in.
router.use(authenticateToken);

/**
 * @route   GET /api/cart
 * @desc    Get user's shopping cart
 * @access  Private
 */
router.get('/', getCart);

/**
 * @route   POST /api/cart/items
 * @desc    Add an item to the cart
 * @access  Private
 */
router.post('/items', addItemToCart);

/**
 * @route   PUT /api/cart/items/:productId
 * @desc    Update quantity of an item in the cart
 * @access  Private
 */
router.put('/items/:productId', updateCartItemQuantity);

/**
 * @route   DELETE /api/cart/items/:productId
 * @desc    Remove an item from the cart
 * @access  Private
 */
router.delete('/items/:productId', removeCartItem);

/**
 * @route   DELETE /api/cart
 * @desc    Clear all items from the cart
 * @access  Private
 */
router.delete('/', clearCart);

export default router;
