import { Router } from 'express';
import { createComment, getAllCommentsByPost, deleteComment } from '../controllers/comment.controller.js';
const router = Router();

router.get('/:postId', getAllCommentsByPost)
router.post('/:postId', createComment);
router.delete('/:commentId', deleteComment);

export default router;

