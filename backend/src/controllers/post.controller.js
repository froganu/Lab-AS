import { pool } from '../config/db.js';

// GET /api/posts/with-comments  (or ?withComments=1)
export const getAllPosts = async (req, res) => {
  try {
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
      username: r.post_username,               // author username
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
    let { user_id, title, description, image_url, tags } = req.body;
    
    if (!user_id || !image_url) {
      return res.status(400).json({ 
        message: 'Falten camps obligatoris: user_id o image_url' 
      });
    }

    // Si viene en Base64, comprime automáticamente
    if (image_url.startsWith('data:image')) {
      try {
        const base64Data = image_url.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        
        // Comprime y reduce tamaño
        const compressedBuffer = await sharp(buffer)
          .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 75 })  // Reduce de 80 a 75 para más compresión
          .toBuffer();
        
        // Reconvierte a Base64
        image_url = 'data:image/jpeg;base64,' + compressedBuffer.toString('base64');
      } catch (err) {
        console.error('Compression error:', err);
        // Si falla, intenta igualmente (puede faltar sharp)
      }
    }
    
    const [result] = await pool.query(
      `INSERT INTO posts (user_id, title, description, image_url, tags)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, title || null, description || null, image_url, tags || null]
    );
    
    res.status(201).json({ 
      message: 'Post creat amb èxit', 
      postId: result.insertId 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el post' });
  }
};



