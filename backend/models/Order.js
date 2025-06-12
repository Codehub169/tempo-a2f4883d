import db from '../config/db.js';

/**
 * Creates a new order and its items within a transaction.
 * @param {object} orderData - Data for the order (user_id, total_amount, shipping_address, status).
 * @param {Array<object>} itemsData - Array of items for the order (product_id, quantity, price).
 * @returns {Promise<object>} The created order object with its ID.
 */
export const createOrderWithItems = (orderData, itemsData) => {
  const { user_id, total_amount, shipping_address, status } = orderData;
  
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('BEGIN TRANSACTION', (err) => {
        if (err) return reject(err);

        const orderSql = 'INSERT INTO Orders (user_id, total_amount, shipping_address, status) VALUES (?, ?, ?, ?)';
        db.run(orderSql, [user_id, total_amount, JSON.stringify(shipping_address), status], function (err) {
          if (err) {
            return db.run('ROLLBACK', () => reject(err));
          }
          const orderId = this.lastID;

          const itemSql = 'INSERT INTO OrderItems (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)';
          const stmt = db.prepare(itemSql);
          let itemsProcessed = 0;

          itemsData.forEach(item => {
            stmt.run(orderId, item.product_id, item.quantity, item.price_at_purchase, (err) => {
              if (err) {
                return db.run('ROLLBACK', () => reject(err));
              }
              itemsProcessed++;
              if (itemsProcessed === itemsData.length) {
                stmt.finalize(errFinalize => {
                  if (errFinalize) {
                     return db.run('ROLLBACK', () => reject(errFinalize));
                  }
                  db.run('COMMIT', (errCommit) => {
                    if (errCommit) {
                       return db.run('ROLLBACK', () => reject(errCommit));
                    }
                    resolve({ id: orderId, ...orderData, items: itemsData });
                  });
                });
              }
            });
          });
          // Handle case where itemsData is empty (should ideally be validated before this function)
          if (itemsData.length === 0) {
             stmt.finalize();
             db.run('COMMIT', (errCommit) => {
                if (errCommit) {
                    return db.run('ROLLBACK', () => reject(errCommit));
                }
                resolve({ id: orderId, ...orderData, items: [] });
             });
          }
        });
      });
    });
  });
};

/**
 * Finds all orders for a specific user, including items.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Array<object>>} An array of order objects with their items.
 */
export const findOrdersByUserId = (userId) => {
  const sql = `
    SELECT
      o.id as order_id, o.user_id, o.total_amount, o.shipping_address, o.status, o.created_at as order_created_at,
      oi.id as item_id, oi.product_id, oi.quantity, oi.price_at_purchase,
      p.name as product_name, p.images as product_images
    FROM Orders o
    JOIN OrderItems oi ON o.id = oi.order_id
    JOIN Products p ON oi.product_id = p.id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
  `;
  return new Promise((resolve, reject) => {
    db.all(sql, [userId], (err, rows) => {
      if (err) return reject(err);

      const ordersMap = new Map();
      rows.forEach(row => {
        if (!ordersMap.has(row.order_id)) {
          ordersMap.set(row.order_id, {
            id: row.order_id,
            user_id: row.user_id,
            total_amount: row.total_amount,
            shipping_address: JSON.parse(row.shipping_address || '{}'),
            status: row.status,
            created_at: row.order_created_at,
            items: []
          });
        }
        ordersMap.get(row.order_id).items.push({
          id: row.item_id,
          product_id: row.product_id,
          quantity: row.quantity,
          price_at_purchase: row.price_at_purchase,
          name: row.product_name,
          images: JSON.parse(row.product_images || '[]')
        });
      });
      resolve(Array.from(ordersMap.values()));
    });
  });
};

/**
 * Finds a single order by its ID, including items, for a specific user.
 * @param {number} orderId - The ID of the order.
 * @param {number} userId - The ID of the user (for authorization).
 * @returns {Promise<object|null>} The order object with items, or null if not found/authorized.
 */
export const findOrderByIdAndUserId = (orderId, userId) => {
  const sql = `
    SELECT
      o.id as order_id, o.user_id, o.total_amount, o.shipping_address, o.status, o.created_at as order_created_at,
      oi.id as item_id, oi.product_id, oi.quantity, oi.price_at_purchase,
      p.name as product_name, p.images as product_images
    FROM Orders o
    JOIN OrderItems oi ON o.id = oi.order_id
    JOIN Products p ON oi.product_id = p.id
    WHERE o.id = ? AND o.user_id = ?
  `;
  return new Promise((resolve, reject) => {
    db.all(sql, [orderId, userId], (err, rows) => {
      if (err) return reject(err);
      if (!rows || rows.length === 0) return resolve(null);

      const order = {
        id: rows[0].order_id,
        user_id: rows[0].user_id,
        total_amount: rows[0].total_amount,
        shipping_address: JSON.parse(rows[0].shipping_address || '{}'),
        status: rows[0].status,
        created_at: rows[0].order_created_at,
        items: rows.map(row => ({
          id: row.item_id,
          product_id: row.product_id,
          quantity: row.quantity,
          price_at_purchase: row.price_at_purchase,
          name: row.product_name,
          images: JSON.parse(row.product_images || '[]')
        }))
      };
      resolve(order);
    });
  });
};
