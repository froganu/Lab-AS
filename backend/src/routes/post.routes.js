import { Router } from 'express';
import { getAllPosts, createPost, getPostWithComments } from '../controllers/post.controller.js';
const router = Router();

router.get('/', getAllPosts);
router.post('/', createPost);
router.get('/:postId', getPostWithComments);

export default router;

