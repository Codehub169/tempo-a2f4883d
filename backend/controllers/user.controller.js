import db from '../config/db.js';
import bcrypt from 'bcryptjs';

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

// Get user profile
export const getUserProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await getQuery('SELECT id, name, email, role, createdAt, updatedAt FROM Users WHERE id = ?', [userId]);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  const userId = req.user.id;
  const { name, email, password } = req.body;

  // Basic validation
  if (!name && !email && !password) {
    return res.status(400).json({ message: 'No update information provided.' });
  }
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.toLowerCase())) {
        return res.status(400).json({ message: 'Invalid email format.' });
    }
  }
  if (password && password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long.'});
  }

  try {
    const currentUser = await getQuery('SELECT * FROM Users WHERE id = ?', [userId]);
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    let updateQuery = 'UPDATE Users SET';
    const params = [];
    const fieldsToUpdate = [];

    if (name && name !== currentUser.name) {
      fieldsToUpdate.push('name = ?');
      params.push(name);
    }

    if (email && email.toLowerCase() !== currentUser.email) {
      const existingUser = await getQuery('SELECT id FROM Users WHERE email = ? AND id != ?', [email.toLowerCase(), userId]);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use by another account.' });
      }
      fieldsToUpdate.push('email = ?');
      params.push(email.toLowerCase());
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      fieldsToUpdate.push('password = ?');
      params.push(hashedPassword);
    }
    
    if (fieldsToUpdate.length === 0) {
        return res.status(200).json({ message: 'No changes detected to update.', user: {id: currentUser.id, name: currentUser.name, email: currentUser.email, role: currentUser.role }});
    }

    fieldsToUpdate.push('updatedAt = datetime(\'now\')');
    updateQuery += ' ' + fieldsToUpdate.join(', ') + ' WHERE id = ?';
    params.push(userId);

    await runQuery(updateQuery, params);

    const updatedUser = await getQuery('SELECT id, name, email, role, createdAt, updatedAt FROM Users WHERE id = ?', [userId]);
    res.json(updatedUser);

  } catch (error) {
    res.status(500).json({ message: 'Error updating user profile', error: error.message });
  }
};
