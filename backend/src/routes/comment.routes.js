import { Router } from 'express';
import { createComment, getAllCommentsByPost, deleteComment, editComment } from '../controllers/comment.controller.js';
const router = Router();

router.get('/:postId', getAllCommentsByPost)
router.post('/:postId', createComment);
router.delete('/:commentId', deleteComment);
router.put('/:commentId', editComment);

export default router;

