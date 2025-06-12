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

// Create a new order
export const createOrder = async (req, res) => {
  const userId = req.user.id;
  const { shippingAddress } = req.body; // Expects an object: { fullName, address, city, state, zip, country }

  if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zip || !shippingAddress.country) {
    return res.status(400).json({ message: 'Missing required shipping address fields' });
  }

  try {
    const cart = await getQuery('SELECT id FROM Carts WHERE userId = ?', [userId]);
    if (!cart) {
      return res.status(400).json({ message: 'Cart not found or empty' });
    }

    const cartItems = await allQuery(
      'SELECT ci.productId, ci.quantity, p.price, p.stock, p.name FROM CartItems ci JOIN Products p ON ci.productId = p.id WHERE ci.cartId = ?',
      [cart.id]
    );

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Check stock for all items
    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for product: ${item.name}. Available: ${item.stock}, Requested: ${item.quantity}` });
      }
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingAddressString = JSON.stringify(shippingAddress);

    // Use a transaction
    await runQuery('BEGIN TRANSACTION');

    const orderResult = await runQuery(
      'INSERT INTO Orders (userId, totalAmount, shippingAddress, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, datetime(\'now\'), datetime(\'now\'))',
      [userId, totalAmount, shippingAddressString, 'Processing']
    );
    const orderId = orderResult.lastID;

    for (const item of cartItems) {
      await runQuery(
        'INSERT INTO OrderItems (orderId, productId, quantity, priceAtPurchase, createdAt, updatedAt) VALUES (?, ?, ?, ?, datetime(\'now\'), datetime(\'now\'))',
        [orderId, item.productId, item.quantity, item.price]
      );
      // Update product stock
      await runQuery('UPDATE Products SET stock = stock - ? WHERE id = ?', [item.quantity, item.productId]);
    }

    // Clear the cart
    await runQuery('DELETE FROM CartItems WHERE cartId = ?', [cart.id]);
    
    await runQuery('COMMIT');

    const newOrder = await getQuery('SELECT * FROM Orders WHERE id = ?', [orderId]);
    const newOrderItems = await allQuery('SELECT oi.*, p.name, p.images FROM OrderItems oi JOIN Products p ON oi.productId = p.id WHERE oi.orderId = ?', [orderId]);
    
    res.status(201).json({ 
        ...newOrder,
        shippingAddress: JSON.parse(newOrder.shippingAddress),
        items: newOrderItems.map(item => ({...item, images: JSON.parse(item.images || '[]')}))
    });

  } catch (error) {
    await runQuery('ROLLBACK');
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

// Get all orders for the logged-in user
export const getUserOrders = async (req, res) => {
  const userId = req.user.id;
  try {
    const orders = await allQuery('SELECT * FROM Orders WHERE userId = ? ORDER BY createdAt DESC', [userId]);
    
    const ordersWithDetails = await Promise.all(orders.map(async (order) => {
        const items = await allQuery(
            'SELECT oi.*, p.name, p.images FROM OrderItems oi JOIN Products p ON oi.productId = p.id WHERE oi.orderId = ?',
            [order.id]
        );
        return {
            ...order,
            shippingAddress: JSON.parse(order.shippingAddress),
            items: items.map(item => ({...item, images: JSON.parse(item.images || '[]')}))
        };
    }));

    res.json(ordersWithDetails);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user orders', error: error.message });
  }
};

// Get a specific order by ID
export const getOrderById = async (req, res) => {
  const userId = req.user.id;
  const { orderId } = req.params;
  try {
    const order = await getQuery('SELECT * FROM Orders WHERE id = ? AND userId = ?', [orderId, userId]);
    if (!order) {
      return res.status(404).json({ message: 'Order not found or access denied' });
    }
    const items = await allQuery(
        'SELECT oi.*, p.name, p.images, p.condition FROM OrderItems oi JOIN Products p ON oi.productId = p.id WHERE oi.orderId = ?',
         [orderId]
    );
    res.json({
        ...order,
        shippingAddress: JSON.parse(order.shippingAddress),
        items: items.map(item => ({...item, images: JSON.parse(item.images || '[]')}))
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order details', error: error.message });
  }
};
