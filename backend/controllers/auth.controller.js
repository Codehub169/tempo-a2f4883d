import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'yourSuperSecretKeyForDevelopment';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Please provide all required fields: name, email, password, and role.' });
  }

  const lowerCaseRole = role.toLowerCase();
  if (!['buyer', 'seller'].includes(lowerCaseRole)) {
    return res.status(400).json({ message: 'Invalid role. Must be either \"buyer\" or \"seller\".' });
  }

  try {
    db.get('SELECT email FROM Users WHERE email = ?', [email.toLowerCase()], async (err, row) => {
      if (err) {
        console.error('Database error during user check:', err.message);
        return res.status(500).json({ message: 'Server error during registration process. Please try again later.' });
      }
      if (row) {
        return res.status(400).json({ message: 'User with this email already exists.' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const lowerCaseEmail = email.toLowerCase();

      const sql = 'INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)';
      db.run(sql, [name, lowerCaseEmail, hashedPassword, lowerCaseRole], function (err) {
        if (err) {
          console.error('Database error during user insertion:', err.message);
          return res.status(500).json({ message: 'Failed to register user due to a server error.' });
        }

        const userId = this.lastID;
        const token = jwt.sign({ id: userId, role: lowerCaseRole }, JWT_SECRET, {
          expiresIn: JWT_EXPIRES_IN,
        });

        res.status(201).json({
          token,
          user: {
            id: userId,
            name,
            email: lowerCaseEmail,
            role: lowerCaseRole,
          },
          message: 'User registered successfully.'
        });
      });
    });
  } catch (error) {
    console.error('Server error during registration:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

/**
 * @desc    Authenticate user & get token (Login)
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide both email and password.' });
  }
  const lowerCaseEmail = email.toLowerCase();

  try {
    db.get('SELECT * FROM Users WHERE email = ?', [lowerCaseEmail], async (err, user) => {
      if (err) {
        console.error('Database error during login:', err.message);
        return res.status(500).json({ message: 'Server error during login process. Please try again later.' });
      }
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials. User not found or email incorrect.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials. Password incorrect.' });
      }

      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
      });

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email, // email is already lowercased from DB
          role: user.role,
        },
        message: 'User logged in successfully.'
      });
    });
  } catch (error) {
    console.error('Server error during login:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

/**
 * @desc    Get current logged-in user details
 * @route   GET /api/auth/me
 * @access  Private (requires token)
 */
export const getCurrentUser = async (req, res) => {
  // req.user is populated by the authenticateToken middleware { id, role }
  const userId = req.user.id;

  try {
    // Exclude password from being sent to the client
    db.get('SELECT id, name, email, role, created_at, updated_at FROM Users WHERE id = ?', [userId], (err, user) => {
      if (err) {
        console.error('Database error fetching current user:', err.message);
        return res.status(500).json({ message: 'Server error fetching user details.' });
      }
      if (!user) {
        // This case should ideally not happen if token is valid and user exists
        return res.status(404).json({ message: 'User not found.' });
      }
      res.json(user);
    });
  } catch (error) {
    console.error('Server error fetching current user:', error);
    res.status(500).json({ message: 'An unexpected server error occurred.' });
  }
};
