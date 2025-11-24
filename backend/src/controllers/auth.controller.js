import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';

const AUTH0_DOMAIN = "dev-x3c6gh35e5ezqobl.eu.auth0.com";
const AUTH0_API_AUDIENCE = "https://forum-api";


export const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Verificar si el correo ya existe
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ? AND auth_provider = "manual"',[email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Cifrar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert - let database handle default if role not provided
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password, role, auth_provider) VALUES (?, ?, ?, ?,"manual")',
      [username, email, hashedPassword, role || 'user']
    );

    res.status(201).json({ message: 'Usuario registrado con éxito', userId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
};

import jwt from "jsonwebtoken";

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND auth_provider = "manual"', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Usuari no trobat' });
    }

    const user = rows[0];

    // Validar contrasenya amb bcrypt
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Contrasenya incorrecta' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET no definit');
      return res.status(500).json({ message: 'Clau JWT no definida' });
    }

    // Generar JWT
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Retornar resposta
    res.json({
      message: 'Login exitoso',
      user: { id: user.id, username: user.username, role: user.role },
      token,
    });
  } catch (error) {
    console.error('ERROR LOGIN:', error);
    res.status(500).json({ message: 'Error a l\'iniciar sessió' });
  }
};

export const isAdmin = (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Token required' });
    }

    // Format: "Bearer <token>"
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token missing' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET no definit');
      return res.status(500).json({ message: 'Clau JWT no definida' });
    }

    // Verifies and decodes token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const isAdmin = (decoded.role === 'admin');
    res.json({ isAdmin });
  } catch (error) {
    console.error('ERROR isAdmin:', error);
    res.status(401).json({ message: 'Token invàlid o error' });
  }
};

export const authLoginUser = async (req, res) => {
  try {
    const { accessToken } = req.body;
    if (!accessToken) return res.status(400).json({ message: "No access token provided" });

    const response = await fetch(
      "https://dev-x3c6gh35e5ezqobl.eu.auth0.com/userinfo",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!response.ok)
      return res.status(401).json({ message: "Token inválido" });

    const auth0User = await response.json();
    const { sub, email, name } = auth0User;

    const [rows] = await pool.query(
      "SELECT * FROM users WHERE auth_provider = 'auth0' AND auth0_user_id = ?",
      [sub]
    );

    let user;

    if (rows.length === 0) {
      const [result] = await pool.query(
        "INSERT INTO users (username, email, role, auth_provider, auth0_user_id) VALUES (?, ?, 'user', 'auth0', ?)",
        [name || email.split("@")[0], email, sub]
      );

      user = {
        id: result.insertId,
        username: name || email.split("@")[0],
        role: "user"
      };

    } else {
      user = rows[0];
    }

    res.json({
      message: "Login OAuth exitoso",
      user: { id: user.id, username: user.username, role: user.role }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al iniciar sesión con Auth0" });
  }
};