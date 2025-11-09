import { pool } from '../config/db.js';

// Get all posts
// GET /api/posts/:postId/comments
export const getAllCommentsByPost = async (req, res) => {
  try {
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
    const { postId } = req.params;                   // comes from the URL
    const { user_id, content } = req.body;           // from JSON body (or use req.user.id if authenticated)

    if (!user_id || !content) {
      return res.status(400).json({ message: 'Falten camps obligatoris: user_id, content' });
    }

    const [result] = await pool.query(
      'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
      [Number(postId), Number(user_id), content]
    );

    return res.status(201).json({ message: 'Comment creat amb èxit', commentId: result.insertId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al crear el comentari' });
  }
};



