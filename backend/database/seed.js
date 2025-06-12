import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database.db');
const schemaFilePath = path.join(__dirname, 'schema.sql');

const applySchema = (dbInstance) => {
    return new Promise((resolve, reject) => {
        fs.readFile(schemaFilePath, 'utf8', (err, sqlScript) => {
            if (err) {
                console.error('Error reading schema file in seed.js:', err.message);
                return reject(new Error('Failed to read schema file: ' + err.message));
            }
            dbInstance.exec(sqlScript, (execErr) => {
                if (execErr) {
                    if (execErr.message.includes('already exists')) {
                        console.log('Seed.js: Schema previously applied or tables exist.');
                        resolve();
                    } else {
                        console.error('Error executing schema in seed.js:', execErr.message);
                        reject(new Error('Failed to execute schema: ' + execErr.message));
                    }
                } else {
                    console.log('Seed.js: Database schema initialized successfully.');
                    resolve();
                }
            });
        });
    });
};

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

const runPreparedStmt = (stmt, params) => {
    return new Promise((resolve, reject) => {
        stmt.run(params, function(err) { // Must use function() to access this.lastID
            if (err) {
                reject(err);
            } else {
                resolve({ lastID: this.lastID, changes: this.changes });
            }
        });
    });
};

const seedUsers = async (db) => {
    const users = [
        { name: 'Alice Buyer', email: 'alice@example.com', password: 'password123', role: 'buyer' },
        { name: 'Bob Seller', email: 'bob@example.com', password: 'password123', role: 'seller' },
        { name: 'Charlie Seller', email: 'charlie@example.com', password: 'password123', role: 'seller' },
        { name: 'Diana Buyer', email: 'diana@example.com', password: 'password123', role: 'buyer' },
        { name: 'Eco Appliances Inc.', email: 'eco@example.com', password: 'password123', role: 'seller' },
    ];
    console.log('Seeding users...');
    const insertUserStmt = db.prepare('INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)');
    for (const user of users) {
        const hashedPassword = await hashPassword(user.password);
        try {
            await runPreparedStmt(insertUserStmt, [user.name, user.email.toLowerCase(), hashedPassword, user.role]);
            console.log(`User ${user.email} inserted.`);
        } catch (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                console.log(`User ${user.email} already exists.`);
            } else {
                console.error(`Error inserting user ${user.email}:`, err.message);
                throw err; // Re-throw to be caught by main error handler
            }
        }
    }
    await new Promise((resolve, reject) => insertUserStmt.finalize(err => err ? reject(err) : resolve()));
    console.log('Finished seeding users.');
};

const seedProducts = async (db) => {
    const products = [
        {
            name: 'Refurbished Smart TV 4K 55"', description: 'Excellent condition 55-inch 4K Smart TV with HDR. Includes remote and stand.',
            price: 299.99, category: 'TVs', condition: 'Excellent', stock: 10,
            images: JSON.stringify(['https://placehold.co/600x400/007BFF/white?text=Refurb+TV+1', 'https://placehold.co/600x400/007BFF/white?text=Refurb+TV+2']),
            sellerId: 2 // Bob Seller (assuming ID 2 if fresh DB)
        },
        {
            name: 'Double Door Fridge - Stainless Steel', description: 'Like new double door refrigerator, energy efficient and spacious. Minor scuffs on side.',
            price: 450.00, category: 'Refrigerators', condition: 'Like New', stock: 5,
            images: JSON.stringify(['https://placehold.co/600x400/28A745/white?text=Refurb+Fridge+1']),
            sellerId: 3 // Charlie Seller (assuming ID 3 if fresh DB)
        },
        {
            name: 'Smartphone XYZ - 128GB', description: 'Certified refurbished Smartphone XYZ, 128GB storage, unlocked. Good working condition, screen has minor scratches.',
            price: 199.00, category: 'Mobile Phones', condition: 'Good', stock: 15,
            images: JSON.stringify(['https://placehold.co/600x400/FFC107/black?text=Refurb+Mobile+1', 'https://placehold.co/600x400/FFC107/black?text=Refurb+Mobile+2']),
            sellerId: 2 // Bob Seller
        },
        {
            name: 'Ultrabook Pro 13" - Core i7', description: 'Seller refurbished Ultrabook Pro, 13-inch display, Core i7, 16GB RAM, 512GB SSD. Excellent cosmetic condition.',
            price: 599.50, category: 'Laptops', condition: 'Excellent', stock: 8,
            images: JSON.stringify(['https://placehold.co/600x400/6C757D/white?text=Refurb+Laptop+1']),
            sellerId: 3 // Charlie Seller
        },
        {
            name: 'Energy Star Washing Machine', description: 'Refurbished front-load washing machine. Energy Star certified. Fully tested and functional.',
            price: 320.00, category: 'Appliances', condition: 'Good', stock: 3,
            images: JSON.stringify(['https://placehold.co/600x400/DC3545/white?text=Washer+1']),
            sellerId: 5 // Eco Appliances Inc. (assuming ID 5 if fresh DB)
        },
        {
            name: 'Gaming Laptop 15.6" - RTX GPU', description: 'Refurbished gaming laptop with dedicated RTX graphics. Perfect for gaming and creative work. Condition: Like New.',
            price: 750.00, category: 'Laptops', condition: 'Like New', stock: 4,
            images: JSON.stringify(['https://placehold.co/600x400/17A2B8/white?text=Gaming+Laptop']),
            sellerId: 2 // Bob Seller
        }
    ];
    console.log('Seeding products...');
    const insertProductStmt = db.prepare('INSERT INTO Products (name, description, price, category, condition, stock, images, sellerId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    for (const product of products) {
        try {
            const imagesString = typeof product.images === 'string' ? product.images : JSON.stringify(product.images || []);
            await runPreparedStmt(insertProductStmt, [product.name, product.description, product.price, product.category, product.condition, product.stock, imagesString, product.sellerId]);
            console.log(`Product ${product.name} inserted.`);
        } catch (err) {
            if (err.message.includes('UNIQUE constraint failed') || err.message.includes('FOREIGN KEY constraint failed')) {
                console.warn(`Skipping product ${product.name} due to constraint: ${err.message}`);
            } else {
                console.error(`Error inserting product ${product.name}:`, err.message);
                throw err; // Re-throw to be caught by main error handler
            }
        }
    }
    await new Promise((resolve, reject) => insertProductStmt.finalize(err => err ? reject(err) : resolve()));
    console.log('Finished seeding products.');
};

const main = async () => {
    let db; // Database instance
    let overallSuccess = true; // Flag to track if any error occurred

    try {
        // 1. Open Database
        // The sqlite3.Database constructor opens the database in OPEN_READWRITE | OPEN_CREATE mode by default.
        db = await new Promise((resolve, reject) => {
            const instance = new sqlite3.Database(dbPath, (err) => {
                if (err) {
                    console.error('Fatal: Error opening database for seeding:', err.message);
                    reject(err); 
                } else {
                    console.log('Successfully connected to the SQLite database for seeding.');
                    resolve(instance);
                }
            });
        });

        // 2. Apply Schema
        console.log('Applying schema...');
        await applySchema(db);
        console.log('Schema applied (or already existed).');

        // 3. Seed Users
        await seedUsers(db);

        // 4. Seed Products
        await seedProducts(db);

        console.log('Database seeding process completed successfully.');

    } catch (error) {
        overallSuccess = false;
        console.error('Critical error during seeding process:', error.message);
        if (error.stack && process.env.NODE_ENV !== 'production') {
            console.error(error.stack);
        }
    } finally {
        if (db) {
            console.log('Closing database connection...');
            try {
                await new Promise((resolve, reject) => {
                    db.close((closeErr) => {
                        if (closeErr) {
                            console.error('Error closing database after seeding:', closeErr.message);
                            overallSuccess = false; 
                            reject(closeErr); 
                        } else {
                            console.log('Database connection closed successfully.');
                            resolve();
                        }
                    });
                });
            } catch (closeDbError) {
                // Error during close is already logged by the promise reject, overallSuccess is false.
            }
        }

        if (overallSuccess) {
            console.log('Seeding script finished successfully.');
            process.exitCode = 0;
        } else {
            console.log('Seeding script finished with errors.');
            process.exitCode = 1;
        }
        // Optional: process.exit(process.exitCode); // if script hangs
    }
};

// Execute main. If main itself has an unhandled synchronous error before its try/catch,
// or an unhandled promise rejection not caught by its try/catch (unlikely with async/await structure),
// this .catch() will handle it.
main().catch(topLevelError => {
    console.error('Top-level unhandled error in seeding script execution:', topLevelError.message);
    if (topLevelError.stack) console.error(topLevelError.stack);
    process.exitCode = 1;
    // Ensure process exits if it was a catastrophic failure before the finally block in main
    if (typeof process.exitCode !== 'undefined') { // Check if exit code already set
        process.exit(process.exitCode);
    } else {
        process.exit(1);
    }
});
