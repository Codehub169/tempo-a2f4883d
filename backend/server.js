import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import db from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/products.routes.js';
// import cartRoutes from './routes/cart.routes.js'; // Future implementation
// import orderRoutes from './routes/orders.routes.js'; // Future implementation
// import userRoutes from './routes/users.routes.js'; // Future implementation

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 9000; // Strictly use port 9000 as per requirement

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // For dev; set FRONTEND_URL in prod if frontend is on a different domain
    credentials: true,
}));
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Database connection test (optional, db.js handles initialization)
async function testDbConnection() {
    try {
        await new Promise((resolve, reject) => {
            db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
                if (err) {
                    console.error('Error querying database for users table:', err.message);
                    return reject(err);
                }
                if (row) {
                    console.log('Users table exists. Database connected and schema likely initialized.');
                } else {
                    console.warn('Users table does not exist. Database initialization might be pending or failed.');
                }
                resolve();
            });
        });
    } catch (error) {
        console.error('Failed to connect to the database or run initial check:', error);
        process.exit(1); // Exit if DB check fails, as it's critical for the app
    }
}
// Call the DB test. It's async but we don't await; it exits on critical failure.
testDbConnection();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
// app.use('/api/cart', cartRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/users', userRoutes);

// Catch-all for API routes that weren't matched by previous handlers
app.use('/api/*', (req, res) => {
    res.status(404).json({ message: 'API endpoint not found.' });
});

// Serve frontend static files and SPA fallback in production
const frontendBuildPath = path.join(__dirname, '../../frontend/dist');
const indexPath = path.resolve(frontendBuildPath, 'index.html');

if (process.env.NODE_ENV === 'production') {
    if (fs.existsSync(frontendBuildPath) && fs.existsSync(indexPath)) {
        app.use(express.static(frontendBuildPath));

        app.get('*', (req, res, next) => {
            // For any non-API, non-static file route, serve index.html for SPA routing
            res.sendFile(indexPath, (err) => {
                if (err) {
                    next(err); // Pass error to global error handler
                }
            });
        });
        console.log(`Production mode: Serving frontend from ${frontendBuildPath}`);
    } else {
        console.warn(`WARNING: Production mode, but frontend build directory ('${frontendBuildPath}') or index.html ('${indexPath}') not found. Frontend will not be served by Express.`);
        // Fallback for root path if frontend is not available
        app.get('/', (req, res) => {
            res.json({ message: 'API is running. Frontend build not found or not served.' });
        });
    }
} else {
    // Development mode: API only, frontend served by its own dev server
    app.get('/', (req, res) => {
        res.json({ message: 'Refurbish Marketplace API is running in development mode.' });
    });
    console.log('Development mode: API server started. Frontend should be served separately.');
}

// Global Error Handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the full error stack for debugging
    const statusCode = err.status || 500;
    
    const errorResponse = {
        message: err.message || 'An unexpected error occurred',
    };

    // Include full error object only in development for security reasons
    if (process.env.NODE_ENV === 'development') {
        errorResponse.error = err; 
    }

    res.status(statusCode).json(errorResponse);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    if (process.env.NODE_ENV === 'production' && (!fs.existsSync(frontendBuildPath) || !fs.existsSync(indexPath))) {
      console.log('Note: Frontend may not be accessible if build is missing or paths are incorrect.');
    }
});

export default app; // For testing purposes if needed
