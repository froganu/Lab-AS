import { pool } from '../config/db.js';
import jwt from 'jsonwebtoken';

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, username, email, role FROM users');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtenir els usuaris' });
  }
};

// Get a certain user by name
export const getUserByName = async (req, res) => {
  try {
    const { username } = req.params; 
    const [rows] = await pool.query(
      'SELECT id, username, email, role FROM users WHERE username = ?',
      [username]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuari no trobat' });
    }
    res.json(rows[0]); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtenir l’usuari' });
  }
};

export const updateProfile = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token missing" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token malformed" });

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const userId = decoded.id;
  const { username, bio, avatar } = req.body; // ara també agafem bio i avatar

  try {
    // Update username, bio i avatar in the database
    await pool.query(
      'UPDATE t_001 SET username = ?, bio = ?, avatar = ? WHERE id = ?',
      [username, bio, avatar, userId]
    );

    // Generate new JWT with updated username
    const newToken = jwt.sign(
      { id: userId, username, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Profile updated", token: newToken, bio, avatar });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getProfile = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token missing" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token malformed" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) return res.status(401).json({ message: "Invalid token" });

    const [rows] = await pool.query(
      "SELECT id, username, email, role, bio, avatar, created_at FROM t_001 WHERE id = ?",
      [decoded.id]
    );

    if (!rows.length) return res.status(404).json({ message: "User not found" });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid token" });
  }
};

export const getUserDataByToken = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Token missing' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
  if (!token) {
    return res.status(401).json({ message: 'Token malformed' });
  }

  try {
    if (!decoded || !decoded.username || !decoded.id || !decoded.role) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    return res.json({ id: decoded.id, username: decoded.username, role: decoded.role });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const editUser = async (req, res) => {
  try {
    const [result] = await pool.query(
      'UPDATE users SET role = ? WHERE id = ?',
      ['user', 2]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: `Role actualizado a 'user' para ` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
