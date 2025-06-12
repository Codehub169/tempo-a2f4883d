import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

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
const PORT = process.env.PORT || 9000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection test (optional, db.js handles initialization)
async function testDbConnection() {
    try {
        // The db object from db.js is the connection itself.
        // A simple query to test if it's working.
        await new Promise((resolve, reject) => {
            db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
                if (err) {
                    console.error('Error querying database for users table:', err.message);
                    return reject(err);
                }
                if (row) {
                    console.log('Users table exists. Database connected and schema likely initialized.');
                } else {
                    console.log('Users table does not exist. Initialization might be pending or failed.');
                }
                resolve();
            });
        });
    } catch (error) {
        console.error('Failed to connect to the database or run initial check:', error);
        process.exit(1);
    }
}
testDbConnection();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
// app.use('/api/cart', cartRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/users', userRoutes);

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
    const frontendBuildPath = path.join(__dirname, '../../frontend/dist');
    app.use(express.static(frontendBuildPath));

    // For any route not handled by API, serve index.html
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(frontendBuildPath, 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('Refurbish Marketplace API is running in development mode.');
    });
}

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'An unexpected error occurred',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app; // For testing purposes if needed
