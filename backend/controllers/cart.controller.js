import db from '../config/db.js';

const runQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

const getQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const allQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Helper to get or create a cart for a user
const getOrCreateCart = async (userId) => {
  let cart = await getQuery('SELECT * FROM Carts WHERE userId = ?', [userId]);
  if (!cart) {
    const result = await runQuery('INSERT INTO Carts (userId, createdAt, updatedAt) VALUES (?, datetime(\'now\'), datetime(\'now\'))', [userId]);
    cart = { id: result.lastID, userId };
  }
  return cart;
};

// Get user's cart
export const getCart = async (req, res) => {
  const userId = req.user.id;
  try {
    const cart = await getOrCreateCart(userId);
    const items = await allQuery(
      'SELECT ci.*, p.name, p.price, p.images, p.condition, p.stock FROM CartItems ci JOIN Products p ON ci.productId = p.id WHERE ci.cartId = ?',
      [cart.id]
    );
    const cartItems = items.map(item => ({
        ...item,
        images: JSON.parse(item.images || '[]')
    }));

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.json({ items: cartItems, totalPrice, cartId: cart.id });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
};

// Add item to cart
export const addItemToCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity = 1 } = req.body;

  if (!productId || quantity <= 0) {
    return res.status(400).json({ message: 'Invalid product ID or quantity' });
  }

  try {
    const product = await getQuery('SELECT * FROM Products WHERE id = ?', [productId]);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    const cart = await getOrCreateCart(userId);
    let cartItem = await getQuery('SELECT * FROM CartItems WHERE cartId = ? AND productId = ?', [cart.id, productId]);

    if (cartItem) {
      const newQuantity = cartItem.quantity + quantity;
      if (product.stock < newQuantity) {
         return res.status(400).json({ message: 'Not enough stock available for updated quantity' });
      }
      await runQuery('UPDATE CartItems SET quantity = ?, updatedAt = datetime(\'now\') WHERE id = ?', [newQuantity, cartItem.id]);
    } else {
      await runQuery('INSERT INTO CartItems (cartId, productId, quantity, createdAt, updatedAt) VALUES (?, ?, ?, datetime(\'now\'), datetime(\'now\'))', [cart.id, productId, quantity]);
    }
    getCart(req, res); // Return updated cart
  } catch (error) {
    res.status(500).json({ message: 'Error adding item to cart', error: error.message });
  }
};

// Update cart item quantity
export const updateCartItemQuantity = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;
  const { quantity } = req.body;

  if (quantity <= 0) {
    return removeCartItem(req, res); // Or handle as error
  }

  try {
    const product = await getQuery('SELECT stock FROM Products WHERE id = ?', [productId]);
    if (!product) return res.status(404).json({ message: 'Product not found in inventory.' });
    if (product.stock < quantity) {
        return res.status(400).json({ message: 'Not enough stock available' });
    }

    const cart = await getQuery('SELECT id FROM Carts WHERE userId = ?', [userId]);
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const result = await runQuery('UPDATE CartItems SET quantity = ?, updatedAt = datetime(\'now\') WHERE cartId = ? AND productId = ?', [quantity, cart.id, productId]);
    if (result.changes === 0) {
        return res.status(404).json({ message: 'Item not found in cart' });
    }
    getCart(req, res); // Return updated cart
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart item quantity', error: error.message });
  }
};

// Remove item from cart
export const removeCartItem = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  try {
    const cart = await getQuery('SELECT id FROM Carts WHERE userId = ?', [userId]);
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const result = await runQuery('DELETE FROM CartItems WHERE cartId = ? AND productId = ?', [cart.id, productId]);
    if (result.changes === 0) {
        return res.status(404).json({ message: 'Item not found in cart to remove' });
    }
    getCart(req, res); // Return updated cart
  } catch (error) {
    res.status(500).json({ message: 'Error removing item from cart', error: error.message });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  const userId = req.user.id;
  try {
    const cart = await getQuery('SELECT id FROM Carts WHERE userId = ?', [userId]);
    if (cart) {
      await runQuery('DELETE FROM CartItems WHERE cartId = ?', [cart.id]);
    }
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing cart', error: error.message });
  }
};
