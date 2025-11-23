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

export const getUsernameByToken = async (req, res) => {
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.username) {
      return res.status(401).json({ message: 'Invalid token or username missing' });
    }

    return res.json({ username: decoded.username });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
