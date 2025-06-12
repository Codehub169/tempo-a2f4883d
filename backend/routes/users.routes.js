import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
} from '../controllers/user.controller.js';
import authenticateToken from '../middleware/authenticateToken.js';

const router = express.Router();

// All user profile routes are protected and require a user to be logged in.
router.use(authenticateToken);

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', getUserProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', updateUserProfile);

export default router;
