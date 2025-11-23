import { pool } from '../config/db.js';
import jwt from 'jsonwebtoken';

// Get all posts
// GET /api/posts/:postId/comments
export const getAllCommentsByPost = async (req, res) => {
  try {

    const authHeader = req.headers.authorization;
        if (!authHeader) {
          return res.status(401).json({ message: 'Token missing' });
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
          return res.status(401).json({ message: 'Token malformed' });
        }
    
        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
          return res.status(401).json({ message: 'Invalid token' });
        }

    const { postId } = req.params;
    const [rows] = await pool.query(
      'SELECT id, post_id, user_id, content, created_at FROM comments WHERE post_id = ? ORDER BY created_at DESC, id DESC',
      [Number(postId)]
    );
    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error obtenint comentaris' });
  }
};


// controllers/comments.controller.js
export const createComment = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
        if (!authHeader) {
          return res.status(401).json({ message: 'Token missing' });
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
          return res.status(401).json({ message: 'Token malformed' });
        }
    
        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
          return res.status(401).json({ message: 'Invalid token' });
       }


    const { postId } = req.params;                   // comes from the URL
    const { content } = req.body;           // from JSON body (or use req.user.id if authenticated)

    if (!content) {
      return res.status(400).json({ message: 'Falten camps obligatoris: user_id, content' });
    }

    const [result] = await pool.query(
      'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
      [Number(postId), Number(decoded.id), content]
    );

    return res.status(201).json({ message: 'Comment creat amb èxit', commentId: result.insertId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al crear el comentari' });
  }
};

export const deleteComment = async (req, res) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Token missing' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token malformed' });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Verificar que el usuario es admin
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied, admin only' });
    }

    // Obtener id del post a eliminar de params
    const commentId = req.params.commentId;
    if (!commentId) {
      return res.status(400).json({ message: 'Comment ID required' });
    }

    // Ejecutar consulta para borrar el post
    const [result] = await pool.query('DELETE FROM comments WHERE id = ?', [commentId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('ERROR deleting comment:', error);
    res.status(500).json({ message: 'Server error deleting comment' });
  }
};



