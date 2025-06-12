import db from '../config/db.js';
import bcrypt from 'bcryptjs';

/**
 * Finds a user by their email address.
 * @param {string} email - The email of the user to find.
 * @returns {Promise<object|null>} The user object or null if not found.
 */
export const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM Users WHERE email = ?', [email.toLowerCase()], (err, user) => {
      if (err) {
        reject(err);
      } else {
        resolve(user || null);
      }
    });
  });
};

/**
 * Finds a user by their ID.
 * @param {number} id - The ID of the user to find.
 * @returns {Promise<object|null>} The user object (without password) or null if not found.
 */
export const findUserById = (id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT id, name, email, role, created_at, updated_at FROM Users WHERE id = ?', [id], (err, user) => {
      if (err) {
        reject(err);
      } else {
        resolve(user || null);
      }
    });
  });
};

/**
 * Creates a new user in the database.
 * @param {object} userData - User data (name, email, password, role).
 * @returns {Promise<object>} The created user object (with ID).
 */
export const createUser = async ({ name, email, password, role }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return new Promise((resolve, reject) => {
    const stmt = db.prepare('INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)');
    stmt.run(name, email.toLowerCase(), hashedPassword, role, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, name, email: email.toLowerCase(), role });
      }
    });
    stmt.finalize();
  });
};

/**
 * Updates an existing user's details.
 * @param {number} userId - The ID of the user to update.
 * @param {object} updates - An object containing fields to update (e.g., { name, email, password }).
 * @returns {Promise<boolean>} True if update was successful, false otherwise.
 */
export const updateUser = async (userId, updates) => {
  const { name, email, password } = updates;
  let fields = [];
  let values = [];

  if (name) {
    fields.push('name = ?');
    values.push(name);
  }
  if (email) {
    fields.push('email = ?');
    values.push(email.toLowerCase());
  }
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    fields.push('password = ?');
    values.push(hashedPassword);
  }

  if (fields.length === 0) {
    return Promise.resolve(true); // No updates to make
  }

  fields.push('updated_at = CURRENT_TIMESTAMP');
  const sql = `UPDATE Users SET ${fields.join(', ')} WHERE id = ?`;
  values.push(userId);

  return new Promise((resolve, reject) => {
    db.run(sql, values, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.changes > 0);
      }
    });
  });
};
