import { pool } from '../config/db.js';
import jwt from 'jsonwebtoken';

// GET /api/posts/with-comments  (or ?withComments=1)
export const getAllPosts = async (req, res) => {
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

    const { limit = 20, offset = 0 } = req.query;

    const sql = `
      WITH comment_counts AS (
        SELECT post_id, COUNT(*) AS commentCount
        FROM comments
        GROUP BY post_id
      )
      SELECT
        p.id,
        p.user_id,
        p.title,
        p.description,
        p.image_url,
        p.tags,
        p.created_at,
        pu.username AS post_username,
        pu.bio AS post_bio,
        pu.avatar AS post_avatar,
        COALESCE(cc.commentCount, 0) AS commentCount
      FROM posts p
      LEFT JOIN users pu ON pu.id = p.user_id
      LEFT JOIN comment_counts cc ON cc.post_id = p.id
      ORDER BY p.created_at DESC, p.id DESC
      LIMIT ? OFFSET ?;

    `;

    const [rows] = await pool.query(sql, [Number(limit), Number(offset)]);

    const result = rows.map(r => ({
      id: r.id,
      user_id: r.user_id,
      username: r.post_username,    // author username
      bio: r.post_bio,              // author bio
      avatar: r.post_avatar,        // author avatar
      title: r.title,
      description: r.description,
      image_url: r.image_url,
      tags: r.tags,
      created_at: r.created_at,
      commentCount: r.commentCount,
    }));


    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obtenint posts amb resum de comentaris' });
  }
};

// Backend: GET /api/posts/:postId/full
export const getPostWithComments = async (req, res) => {

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
  }
  catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const { postId } = req.params;
  const sql = `
    SELECT 
      p.id, p.user_id, p.title, p.description, p.image_url, p.tags, p.created_at,
      pu.username AS post_username,
      c.id AS comment_id, c.user_id AS comment_user_id, c.content AS comment_content,
      c.created_at AS comment_created_at,
      cu.username AS comment_username
    FROM posts p
    LEFT JOIN users pu ON pu.id = p.user_id
    LEFT JOIN comments c ON c.post_id = p.id
    LEFT JOIN users cu ON cu.id = c.user_id
    WHERE p.id = ?
    ORDER BY c.created_at DESC;
  `;
  const [rows] = await pool.query(sql, [postId]);
  
  if (!rows.length) return res.status(404).json({ message: 'Post not found' });
  
  const post = {
    id: rows[0].id,
    user_id: rows[0].user_id,
    username: rows[0].post_username,
    title: rows[0].title,
    description: rows[0].description,
    image_url: rows[0].image_url,
    tags: rows[0].tags,
    created_at: rows[0].created_at,
    comments: rows[0].comment_id ? rows.map(r => ({
      id: r.comment_id,
      user_id: r.comment_user_id,
      username: r.comment_username,
      content: r.comment_content,
      created_at: r.comment_created_at
    })) : []
  };
  
  res.json(post);
};

// post.controller.js
import sharp from 'sharp';

export const createPost = async (req, res) => {
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

    let { title, description, image_url, tags } = req.body;

    if (!image_url) {
      return res.status(400).json({ 
        message: 'Falten camps obligatoris: image_url' 
      });
    }

    // Si l'imatge ve en Base64, comprimeix
    if (image_url.startsWith('data:image')) {
      try {
        const base64Data = image_url.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        const compressedBuffer = await sharp(buffer)
          .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 75 })
          .toBuffer();

        image_url = 'data:image/jpeg;base64,' + compressedBuffer.toString('base64');
      } catch (err) {
        console.error('Compression error:', err);
      }
    }

    // INSERT amb user_id del token
    const [result] = await pool.query(
      `INSERT INTO posts (user_id, title, description, image_url, tags)
       VALUES (?, ?, ?, ?, ?)`,
      [decoded.id, title || null, description || null, image_url, tags || null]
    );

    res.status(201).json({ 
      message: 'Post creat amb èxit', 
      postId: result.insertId 
    });
  } catch (error) {
    console.error(error);

    // Error específic per clau forana
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ message: 'L’usuari no existeix a la base de dades' });
    }

    res.status(500).json({ message: 'Error al crear el post' });
  }
};


export const deletePost = async (req, res) => {
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
    const postId = req.params.postId;
    if (!postId) {
      return res.status(400).json({ message: 'Post ID required' });
    }

    // Ejecutar consulta para borrar el post
    const [result] = await pool.query('DELETE FROM posts WHERE id = ?', [postId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('ERROR deleting post:', error);
    res.status(500).json({ message: 'Server error deleting post' });
  }
};

export const editPost = async (req, res) => {
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

    // Verificar que el usuario es admin
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied, admin only' });
    }

    const { postId } = req.params; // id del post a editar
    const { title } = req.body; // nuevo título

    if (!postId || !title) {
      return res.status(400).json({
        message: 'Falten camps obligatoris: id o title'
      });
    }

    const [result] = await pool.query(
      'UPDATE posts SET title = ? WHERE id = ?',
      [title, postId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No s\'ha trobat el post' });
    }

    res.status(200).json({
      message: 'Títol actualitzat amb èxit',
      postId: postId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualitzar el títol' });
  }
};


