import { pool } from '../config/db.js';

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

