import db from '../config/db.js';

/**
 * Creates a new product.
 * @param {object} productData - Product data (name, description, price, category, condition, stock, seller_id, images).
 * @returns {Promise<object>} The created product object with its ID.
 */
export const createProduct = (productData) => {
  const { name, description, price, category, condition, stock, seller_id, images } = productData;
  const sql = 'INSERT INTO Products (name, description, price, category, condition, stock, seller_id, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  return new Promise((resolve, reject) => {
    db.run(sql, [name, description, price, category, condition, stock, seller_id, JSON.stringify(images)], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, ...productData, images });
      }
    });
  });
};

/**
 * Finds a product by its ID.
 * @param {number} id - The ID of the product.
 * @returns {Promise<object|null>} The product object or null if not found.
 */
export const findProductById = (id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM Products WHERE id = ?', [id], (err, product) => {
      if (err) {
        reject(err);
      } else {
        if (product) {
          product.images = JSON.parse(product.images || '[]');
        }
        resolve(product || null);
      }
    });
  });
};

/**
 * Finds all products with filtering, sorting, and pagination.
 * @param {object} queryParams - Parameters for filtering, sorting, pagination.
 * @returns {Promise<{products: Array<object>, total: number, page: number, limit: number,totalPages: number}>}
 */
export const findAllProducts = ({ search, category, condition, minPrice, maxPrice, sortBy, sortOrder, page = 1, limit = 10, seller_id }) => {
  let baseQuery = 'SELECT p.*, u.name as seller_name FROM Products p JOIN Users u ON p.seller_id = u.id';
  let countQuery = 'SELECT COUNT(*) as total FROM Products p JOIN Users u ON p.seller_id = u.id';
  let conditions = [];
  let params = [];

  if (search) {
    conditions.push('(p.name LIKE ? OR p.description LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }
  if (category) {
    conditions.push('p.category = ?');
    params.push(category);
  }
  if (condition) {
    conditions.push('p.condition = ?');
    params.push(condition);
  }
  if (minPrice) {
    conditions.push('p.price >= ?');
    params.push(parseFloat(minPrice));
  }
  if (maxPrice) {
    conditions.push('p.price <= ?');
    params.push(parseFloat(maxPrice));
  }
  if (seller_id) {
    conditions.push('p.seller_id = ?');
    params.push(seller_id);
  }

  if (conditions.length > 0) {
    baseQuery += ' WHERE ' + conditions.join(' AND ');
    countQuery += ' WHERE ' + conditions.join(' AND ');
  }

  const validSortBy = ['price', 'created_at', 'name'];
  const sortField = validSortBy.includes(sortBy) ? `p.${sortBy}` : 'p.created_at';
  const orderDirection = sortOrder && sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  baseQuery += ` ORDER BY ${sortField} ${orderDirection}`;

  const offset = (page - 1) * limit;
  baseQuery += ' LIMIT ? OFFSET ?';
  const queryParams = [...params, limit, offset];

  return new Promise((resolve, reject) => {
    db.get(countQuery, params, (err, row) => {
      if (err) return reject(err);
      const total = row.total;
      db.all(baseQuery, queryParams, (err, products) => {
        if (err) return reject(err);
        const parsedProducts = products.map(p => ({ ...p, images: JSON.parse(p.images || '[]') }));
        resolve({
          products: parsedProducts,
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit)
        });
      });
    });
  });
};

/**
 * Updates an existing product.
 * @param {number} id - The ID of the product to update.
 * @param {object} productData - Data to update.
 * @returns {Promise<boolean>} True if update was successful.
 */
export const updateProduct = (id, productData) => {
  const { name, description, price, category, condition, stock, images } = productData;
  const sql = 'UPDATE Products SET name = ?, description = ?, price = ?, category = ?, condition = ?, stock = ?, images = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.run(sql, [name, description, price, category, condition, stock, JSON.stringify(images), id], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes > 0);
      }
    });
  });
};

/**
 * Deletes a product by its ID.
 * @param {number} id - The ID of the product to delete.
 * @returns {Promise<boolean>} True if deletion was successful.
 */
export const deleteProductById = (id) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM Products WHERE id = ?', [id], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes > 0);
      }
    });
  });
};

/**
 * Updates the stock of a product.
 * @param {number} productId - The ID of the product.
 * @param {number} quantityChange - The amount to change the stock by (can be negative).
 * @param {import('sqlite3').Database} [txDb=db] - Optional database instance for transactions.
 * @returns {Promise<void>}
 */
export const updateProductStock = (productId, quantityChange, txDb = db) => {
  const sql = 'UPDATE Products SET stock = stock + ? WHERE id = ?';
  return new Promise((resolve, reject) => {
    txDb.run(sql, [quantityChange, productId], function(err) {
      if (err) {
        reject(err);
      } else if (this.changes === 0) {
        reject(new Error('Product not found or stock update failed.'));
      } else {
        resolve();
      }
    });
  });
};
