import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Error opening database for seeding:', err.message);
        return;
    }
    console.log('Connected to the SQLite database for seeding.');
});

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

const seedUsers = async () => {
    const users = [
        { name: 'Alice Buyer', email: 'alice@example.com', password: 'password123', role: 'buyer' },
        { name: 'Bob Seller', email: 'bob@example.com', password: 'password123', role: 'seller' },
        { name: 'Charlie Seller', email: 'charlie@example.com', password: 'password123', role: 'seller' },
        { name: 'Diana Buyer', email: 'diana@example.com', password: 'password123', role: 'buyer' },
        { name: 'Eco Appliances Inc.', email: 'eco@example.com', password: 'password123', role: 'seller' },
    ];

    const insertUser = db.prepare('INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)');
    for (const user of users) {
        const hashedPassword = await hashPassword(user.password);
        insertUser.run(user.name, user.email.toLowerCase(), hashedPassword, user.role, (err) => {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    console.log(`User ${user.email} already exists.`);
                } else {
                    console.error('Error inserting user:', user.email, err.message);
                }
            } else {
                console.log(`User ${user.email} inserted.`);
            }
        });
    }
    insertUser.finalize();
};

const seedProducts = async () => {
    // Ensure sellers exist before seeding products
    // For simplicity, we'll assume Bob (ID 2) and Charlie (ID 3) and Eco (ID 5) are sellers
    const products = [
        {
            name: 'Refurbished Smart TV 4K 55"', description: 'Excellent condition 55-inch 4K Smart TV with HDR. Includes remote and stand.',
            price: 299.99, category: 'TVs', condition: 'Excellent', stock: 10,
            images: JSON.stringify(['https://placehold.co/600x400/007BFF/white?text=Refurb+TV+1', 'https://placehold.co/600x400/007BFF/white?text=Refurb+TV+2']),
            sellerId: 2 // Bob Seller
        },
        {
            name: 'Double Door Fridge - Stainless Steel', description: 'Like new double door refrigerator, energy efficient and spacious. Minor scuffs on side.',
            price: 450.00, category: 'Refrigerators', condition: 'Like New', stock: 5,
            images: JSON.stringify(['https://placehold.co/600x400/28A745/white?text=Refurb+Fridge+1']),
            sellerId: 3 // Charlie Seller
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
            sellerId: 5 // Eco Appliances Inc.
        },
        {
            name: 'Gaming Laptop 15.6" - RTX GPU', description: 'Refurbished gaming laptop with dedicated RTX graphics. Perfect for gaming and creative work. Condition: Like New.',
            price: 750.00, category: 'Laptops', condition: 'Like New', stock: 4,
            images: JSON.stringify(['https://placehold.co/600x400/17A2B8/white?text=Gaming+Laptop']),
            sellerId: 2 // Bob Seller
        }
    ];

    const insertProduct = db.prepare('INSERT INTO Products (name, description, price, category, condition, stock, images, sellerId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    for (const product of products) {
        insertProduct.run(product.name, product.description, product.price, product.category, product.condition, product.stock, product.images, product.sellerId, (err) => {
            if (err) {
                 if (err.message.includes('UNIQUE constraint failed') || err.message.includes('FOREIGN KEY constraint failed')) {
                    console.warn(`Skipping product ${product.name} due to constraint: ${err.message}`);
                } else {
                    console.error('Error inserting product:', product.name, err.message);
                }
            } else {
                console.log(`Product ${product.name} inserted.`);
            }
        });
    }
    insertProduct.finalize();
};


const main = async () => {
    db.serialize(async () => {
        console.log('Starting database seeding...');
        await seedUsers();
        // Add a delay or use callbacks to ensure users are inserted before products if IDs are critical and not hardcoded
        // For this script, we assume user IDs will be consistent if run on an empty DB or handle potential errors.
        setTimeout(async () => { // Simple delay for user insertion to complete
            await seedProducts();
            console.log('Database seeding finished.');
            db.close((err) => {
                if (err) {
                    console.error('Error closing database:', err.message);
                } else {
                    console.log('Database connection closed.');
                }
            });
        }, 2000); // 2 second delay, adjust as needed or implement proper promise chaining
    });
};

main().catch(err => {
    console.error('Seeding script failed:', err);
    db.close();
});
