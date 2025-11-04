import { Router } from 'express';
import { getAllPosts, createPost, getAllPostsAndComment } from '../controllers/post.controller.js';
const router = Router();

router.get('/', getAllPosts);
router.get('/comments', getAllPostsAndComment);
router.post('/',createPost);

export default router;

