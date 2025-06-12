-- SQLite Schema for Refurbish Marketplace

-- Users Table
CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('buyer', 'seller')), -- 'buyer' or 'seller'
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS Products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL, -- e.g., 'TVs', 'Fridges', 'Mobile Phones', 'Laptops'
    condition TEXT NOT NULL CHECK(condition IN ('Like New', 'Excellent', 'Good', 'Fair')), -- Predefined condition grades
    stock INTEGER NOT NULL DEFAULT 0,
    images TEXT, -- JSON array of image URLs or paths
    sellerId INTEGER NOT NULL,
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'sold_out')),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sellerId) REFERENCES Users(id) ON DELETE CASCADE
);

-- Carts Table (represents a user's active cart)
CREATE TABLE IF NOT EXISTS Carts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL UNIQUE, -- Each user has one cart
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);

-- CartItems Table (links products to carts with quantities)
CREATE TABLE IF NOT EXISTS CartItems (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cartId INTEGER NOT NULL,
    productId INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    addedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cartId) REFERENCES Carts(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES Products(id) ON DELETE CASCADE,
    UNIQUE(cartId, productId) -- Ensures a product appears only once per cart, quantity handles multiple units
);

-- Orders Table
CREATE TABLE IF NOT EXISTS Orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    totalAmount REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK(status IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled')), -- Order status
    shippingAddress TEXT NOT NULL, -- JSON object with address details
    paymentMethod TEXT, -- Simulated, e.g., 'Card (Simulated)'
    paymentStatus TEXT DEFAULT 'Paid' CHECK(paymentStatus IN ('Paid', 'Pending', 'Failed')),
    orderDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE SET NULL -- Keep order history even if user is deleted, or use ON DELETE RESTRICT
);

-- OrderItems Table (links products to orders with quantities and price at time of purchase)
CREATE TABLE IF NOT EXISTS OrderItems (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId INTEGER NOT NULL,
    productId INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    priceAtPurchase REAL NOT NULL, -- Price of the product at the time of order
    productName TEXT NOT NULL, -- Store product name at time of purchase
    productImage TEXT, -- Store one image URL at time of purchase
    conditionAtPurchase TEXT, -- Store condition at time of purchase
    sellerId INTEGER, -- Store sellerId at time of purchase
    FOREIGN KEY (orderId) REFERENCES Orders(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES Products(id) ON DELETE SET NULL, -- Keep item in order even if product is deleted
    FOREIGN KEY (sellerId) REFERENCES Users(id) ON DELETE SET NULL
);

-- Triggers to update 'updatedAt' timestamps
CREATE TRIGGER IF NOT EXISTS update_users_updatedAt AFTER UPDATE ON Users
FOR EACH ROW
BEGIN
    UPDATE Users SET updatedAt = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

CREATE TRIGGER IF NOT EXISTS update_products_updatedAt AFTER UPDATE ON Products
FOR EACH ROW
BEGIN
    UPDATE Products SET updatedAt = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

CREATE TRIGGER IF NOT EXISTS update_carts_updatedAt AFTER UPDATE ON Carts
FOR EACH ROW
BEGIN
    UPDATE Carts SET updatedAt = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

CREATE TRIGGER IF NOT EXISTS update_orders_updatedAt AFTER UPDATE ON Orders
FOR EACH ROW
BEGIN
    UPDATE Orders SET updatedAt = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;
