import db from '../config/db.js';

/**
 * Finds or creates a cart for a user.
 * @param {number} userId - The ID of the user.
 * @param {import('sqlite3').Database} [txDb=db] - Optional database instance for transactions.
 * @returns {Promise<object>} The cart object (id, user_id, created_at, updated_at).
 */
export const findOrCreateCartByUserId = (userId, txDb = db) => {
  return new Promise((resolve, reject) => {
    txDb.get('SELECT * FROM Carts WHERE user_id = ?', [userId], (err, cart) => {
      if (err) return reject(err);
      if (cart) return resolve(cart);

      // Create a new cart if one doesn't exist
      txDb.run('INSERT INTO Carts (user_id) VALUES (?)', [userId], function (err) {
        if (err) return reject(err);
        txDb.get('SELECT * FROM Carts WHERE id = ?', [this.lastID], (err, newCart) => {
          if (err) return reject(err);
          resolve(newCart);
        });
      });
    });
  });
};

/**
 * Gets a cart with its items and product details.
 * @param {number} cartId - The ID of the cart.
 * @returns {Promise<object|null>} Cart object with items or null if not found.
 */
export const getCartWithItems = (cartId) => {
  const sql = `
    SELECT
      c.id as cart_id,
      c.user_id,
      ci.id as cart_item_id,
      ci.product_id,
      ci.quantity,
      p.name as product_name,
      p.price as product_price,
      p.images as product_images,
      p.stock as product_stock,
      p.condition as product_condition,
      u.name as seller_name
    FROM Carts c
    LEFT JOIN CartItems ci ON c.id = ci.cart_id
    LEFT JOIN Products p ON ci.product_id = p.id
    LEFT JOIN Users u ON p.seller_id = u.id
    WHERE c.id = ?
  `;
  return new Promise((resolve, reject) => {
    db.all(sql, [cartId], (err, rows) => {
      if (err) return reject(err);
      if (!rows || rows.length === 0 || !rows[0].cart_id) return resolve(null); // Cart exists but might be empty
      
      const cart = {
        id: rows[0].cart_id,
        user_id: rows[0].user_id,
        items: [],
        total_price: 0
      };

      if (rows[0].cart_item_id) { // Check if there are any items
         cart.items = rows.map(row => ({
          id: row.cart_item_id,
          product_id: row.product_id,
          quantity: row.quantity,
          name: row.product_name,
          price: row.product_price,
          images: JSON.parse(row.product_images || '[]'),
          stock: row.product_stock,
          condition: row.product_condition,
          seller_name: row.seller_name
        }));
        cart.total_price = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      }
      resolve(cart);
    });
  });
};

/**
 * Finds a specific item in a cart.
 * @param {number} cartId - The ID of the cart.
 * @param {number} productId - The ID of the product.
 * @param {import('sqlite3').Database} [txDb=db] - Optional database instance for transactions.
 * @returns {Promise<object|null>} The cart item or null if not found.
 */
export const findCartItem = (cartId, productId, txDb = db) => {
  return new Promise((resolve, reject) => {
    txDb.get('SELECT * FROM CartItems WHERE cart_id = ? AND product_id = ?', [cartId, productId], (err, item) => {
      if (err) reject(err);
      else resolve(item || null);
    });
  });
};

/**
 * Adds an item to the cart or updates its quantity if it already exists.
 * @param {number} cartId - The ID of the cart.
 * @param {number} productId - The ID of the product.
 * @param {number} quantity - The quantity to add.
 * @param {import('sqlite3').Database} [txDb=db] - Optional database instance for transactions.
 * @returns {Promise<object>} The added/updated cart item.
 */
export const addOrUpdateCartItem = (cartId, productId, quantity, txDb = db) => {
  return new Promise(async (resolve, reject) => {
    try {
      const existingItem = await findCartItem(cartId, productId, txDb);
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        txDb.run('UPDATE CartItems SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [newQuantity, existingItem.id], function (err) {
          if (err) reject(err);
          else resolve({ id: existingItem.id, cart_id: cartId, product_id: productId, quantity: newQuantity });
        });
      } else {
        txDb.run('INSERT INTO CartItems (cart_id, product_id, quantity) VALUES (?, ?, ?)', [cartId, productId, quantity], function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, cart_id: cartId, product_id: productId, quantity });
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Updates the quantity of an item in the cart.
 * @param {number} cartItemId - The ID of the cart item.
 * @param {number} quantity - The new quantity.
 * @param {import('sqlite3').Database} [txDb=db] - Optional database instance for transactions.
 * @returns {Promise<boolean>} True if update was successful.
 */
export const updateCartItemQuantity = (cartItemId, quantity, txDb = db) => {
  return new Promise((resolve, reject) => {
    txDb.run('UPDATE CartItems SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [quantity, cartItemId], function (err) {
      if (err) reject(err);
      else resolve(this.changes > 0);
    });
  });
};

/**
 * Removes an item from the cart.
 * @param {number} cartItemId - The ID of the cart item to remove.
 * @param {import('sqlite3').Database} [txDb=db] - Optional database instance for transactions.
 * @returns {Promise<boolean>} True if removal was successful.
 */
export const removeCartItem = (cartItemId, txDb = db) => {
  return new Promise((resolve, reject) => {
    txDb.run('DELETE FROM CartItems WHERE id = ?', [cartItemId], function (err) {
      if (err) reject(err);
      else resolve(this.changes > 0);
    });
  });
};

/**
 * Clears all items from a cart.
 * @param {number} cartId - The ID of the cart.
 * @param {import('sqlite3').Database} [txDb=db] - Optional database instance for transactions.
 * @returns {Promise<boolean>} True if clearing was successful.
 */
export const clearCart = (cartId, txDb = db) => {
  return new Promise((resolve, reject) => {
    txDb.run('DELETE FROM CartItems WHERE cart_id = ?', [cartId], function (err) {
      if (err) reject(err);
      // It's successful even if no items were deleted (e.g., cart was already empty)
      else resolve(true); 
    });
  });
};
