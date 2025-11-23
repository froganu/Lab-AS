import { Router } from 'express';
import { getAllPosts, createPost, getPostWithComments, deletePost, editPost } from '../controllers/post.controller.js';
const router = Router();

router.get('/', getAllPosts);
router.post('/', createPost);
router.get('/:postId', getPostWithComments);
router.delete('/:postId', deletePost);
router.put('/:postId', editPost);

export default router;

