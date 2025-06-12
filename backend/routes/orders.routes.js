import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
} from '../controllers/order.controller.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();

// All order routes are protected and require a user to be logged in.
router.use(authenticateToken);

/**
 * @route   POST /api/orders
 * @desc    Create a new order
 * @access  Private
 */
router.post('/', createOrder);

/**
 * @route   GET /api/orders
 * @desc    Get all orders for the authenticated user
 * @access  Private
 */
router.get('/', getUserOrders);

/**
 * @route   GET /api/orders/:orderId
 * @desc    Get a specific order by ID for the authenticated user
 * @access  Private
 */
router.get('/:orderId', getOrderById);

export default router;
