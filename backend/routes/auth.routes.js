import express from 'express';
import {
    registerUser,
    loginUser,
    getCurrentUser
} from '../controllers/auth.controller.js'; // Controller to be implemented
import authenticateToken from '../middleware/authenticateToken.js'; // Middleware to be implemented

const router = express.Router();

// @route   POST api/auth/register
// @desc    Register a new user (buyer or seller)
// @access  Public
router.post('/register', registerUser);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', loginUser);

// @route   GET api/auth/me
// @desc    Get current logged-in user details (excluding password)
// @access  Private
router.get('/me', authenticateToken, getCurrentUser);

export default router;
