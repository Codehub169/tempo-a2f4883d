import db from '../config/db.js';

const runQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        console.error('DB Run Error:', err.message, 'SQL:', sql, 'Params:', params);
        reject(err);
      } else {
        resolve({ lastID: this.lastID, changes: this.changes });
      }
    });
  });
};

const getQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        console.error('DB Get Error:', err.message, 'SQL:', sql, 'Params:', params);
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

const allQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error('DB All Error:', err.message, 'SQL:', sql, 'Params:', params);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Get all products with filtering, sorting, and pagination
export const getAllProducts = async (req, res) => {
  const { category, condition, minPrice, maxPrice, sortBy, sortOrder = 'ASC', page = 1, limit = 10 } = req.query;

  let query = 'SELECT p.*, u.name as sellerName FROM Products p JOIN Users u ON p.sellerId = u.id WHERE 1=1';
  const params = [];

  if (category) {
    query += ' AND p.category = ?';
    params.push(category);
  }
  if (condition) {
    query += ' AND p.condition = ?';
    params.push(condition);
  }
  if (minPrice) {
    query += ' AND p.price >= ?';
    params.push(parseFloat(minPrice));
  }
  if (maxPrice) {
    query += ' AND p.price <= ?';
    params.push(parseFloat(maxPrice));
  }

  const validSortColumns = ['price', 'createdAt', 'name'];
  if (sortBy && validSortColumns.includes(sortBy)) {
    query += ` ORDER BY p.${sortBy} ${sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'}`;
  } else {
    query += ' ORDER BY p.createdAt DESC';
  }

  const offset = (parseInt(page) - 1) * parseInt(limit);
  query += ' LIMIT ? OFFSET ?';
  params.push(parseInt(limit), offset);

  try {
    const products = await allQuery(query, params);
    
    let countQuery = 'SELECT COUNT(*) as total FROM Products WHERE 1=1';
    const countParams = [];
    if (category) { countQuery += ' AND category = ?'; countParams.push(category); }
    if (condition) { countQuery += ' AND condition = ?'; countParams.push(condition); }
    if (minPrice) { countQuery += ' AND price >= ?'; countParams.push(parseFloat(minPrice)); }
    if (maxPrice) { countQuery += ' AND price <= ?'; countParams.push(parseFloat(maxPrice)); }

    const { total } = await getQuery(countQuery, countParams);
    
    res.json({
      products: products.map(p => ({...p, images: JSON.parse(p.images || '[]')})),
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      totalProducts: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// Get a single product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await getQuery('SELECT p.*, u.name as sellerName, u.email as sellerEmail FROM Products p JOIN Users u ON p.sellerId = u.id WHERE p.id = ?', [req.params.id]);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({...product, images: JSON.parse(product.images || '[]')});
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

// Create a new product (seller only)
export const createProduct = async (req, res) => {
  if (req.user.role !== 'seller') {
    return res.status(403).json({ message: 'Forbidden: Only sellers can create products.' });
  }
  const { name, description, price, category, condition, stock, images } = req.body;
  const sellerId = req.user.id;

  if (!name || !description || price == null || !category || !condition || stock == null) {
    return res.status(400).json({ message: 'Missing required product fields' });
  }

  try {
    const imagesString = JSON.stringify(images || []);
    const result = await runQuery(
      'INSERT INTO Products (name, description, price, category, condition, stock, images, sellerId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime(\'now\'), datetime(\'now\'))',
      [name, description, parseFloat(price), category, condition, parseInt(stock), imagesString, sellerId]
    );
    const newProduct = await getQuery('SELECT p.*, u.name as sellerName FROM Products p JOIN Users u ON p.sellerId = u.id WHERE p.id = ?', [result.lastID]);
    res.status(201).json({...newProduct, images: JSON.parse(newProduct.images || '[]')});
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

// Update an existing product (seller only, own product)
export const updateProduct = async (req, res) => {
  if (req.user.role !== 'seller') {
    return res.status(403).json({ message: 'Forbidden: Only sellers can update products.' });
  }
  const productId = req.params.id;
  const sellerId = req.user.id;
  const { name, description, price, category, condition, stock, images } = req.body;

  try {
    const product = await getQuery('SELECT * FROM Products WHERE id = ?', [productId]);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.sellerId !== sellerId) {
      return res.status(403).json({ message: 'Forbidden: You can only update your own products.' });
    }

    const imagesString = JSON.stringify(images || product.images);
    await runQuery(
      'UPDATE Products SET name = ?, description = ?, price = ?, category = ?, condition = ?, stock = ?, images = ?, updatedAt = datetime(\'now\') WHERE id = ?',
      [name, description, parseFloat(price), category, condition, parseInt(stock), imagesString, productId]
    );
    const updatedProduct = await getQuery('SELECT p.*, u.name as sellerName FROM Products p JOIN Users u ON p.sellerId = u.id WHERE p.id = ?', [productId]);
    res.json({...updatedProduct, images: JSON.parse(updatedProduct.images || '[]')});
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

// Delete a product (seller only, own product)
export const deleteProduct = async (req, res) => {
  if (req.user.role !== 'seller') {
    return res.status(403).json({ message: 'Forbidden: Only sellers can delete products.' });
  }
  const productId = req.params.id;
  const sellerId = req.user.id;

  try {
    const product = await getQuery('SELECT * FROM Products WHERE id = ?', [productId]);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.sellerId !== sellerId) {
      return res.status(403).json({ message: 'Forbidden: You can only delete your own products.' });
    }

    await runQuery('DELETE FROM Products WHERE id = ?', [productId]);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

// Get products listed by the authenticated seller
export const getSellerProducts = async (req, res) => {
  if (req.user.role !== 'seller') {
    return res.status(403).json({ message: 'Forbidden: This action is for sellers only.' });
  }
  const sellerId = req.user.id;
  const { page = 1, limit = 10 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  try {
    const products = await allQuery('SELECT * FROM Products WHERE sellerId = ? ORDER BY createdAt DESC LIMIT ? OFFSET ?', [sellerId, parseInt(limit), offset]);
    const { total } = await getQuery('SELECT COUNT(*) as total FROM Products WHERE sellerId = ?', [sellerId]);
    
    res.json({
      products: products.map(p => ({...p, images: JSON.parse(p.images || '[]')})),
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      totalProducts: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching seller products', error: error.message });
  }
};
