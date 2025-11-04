import { pool } from '../config/db.js';

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, user_id, title, description, image_url, tags, created_at FROM posts');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtenir els posts' });
  }
};

export const getAllPostsAndComment = async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const sql = `
      WITH latest_comment AS (
        SELECT
          c.id AS comment_id,
          c.post_id,
          c.user_id AS comment_user_id,
          c.content AS comment_content,
          c.created_at AS comment_created_at,
          ROW_NUMBER() OVER (
            PARTITION BY c.post_id
            ORDER BY c.created_at DESC, c.id DESC
          ) AS rn
        FROM comments c
      ),
      comment_counts AS (
        SELECT post_id, COUNT(*) AS commentCount
        FROM comments
        GROUP BY post_id
      )
      SELECT
        p.id, p.user_id, p.title, p.description, p.image_url, p.tags, p.created_at,
        COALESCE(cc.commentCount, 0) AS commentCount,
        lc.comment_id        AS preview_comment_id,
        lc.comment_user_id   AS preview_comment_user_id,
        lc.comment_content   AS preview_comment_content,
        lc.comment_created_at AS preview_comment_created_at
      FROM posts p
      LEFT JOIN comment_counts cc ON cc.post_id = p.id
      LEFT JOIN latest_comment lc ON lc.post_id = p.id AND lc.rn = 1
      ORDER BY p.created_at DESC, p.id DESC
      LIMIT ? OFFSET ?;
    `;

    const [rows] = await pool.query(sql, [Number(limit), Number(offset)]);
    res.json(rows.map(r => ({
      id: r.id,
      user_id: r.user_id,
      title: r.title,
      description: r.description,
      image_url: r.image_url,
      tags: r.tags,
      created_at: r.created_at,
      commentCount: r.commentCount,
      commentPreview: r.preview_comment_id ? {
        id: r.preview_comment_id,
        user_id: r.preview_comment_user_id,
        content: r.preview_comment_content,
        created_at: r.preview_comment_created_at
      } : null
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error getting posts with comment preview' });
  }
};


// Create a post
export const createPost = async (req, res) => {
  try {
    const { user_id, title, description, image_url, tags } = req.body;
    if (!user_id || !image_url) {
      return res.status(400).json({ message: 'Falten camps obligatoris: user_id o image_url' });
    }
    const [result] = await pool.query(
      `INSERT INTO posts (user_id, title, description, image_url, tags)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, title || null , description || null, image_url, tags || null]
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

