import { Router } from 'express';
import { createComment, getAllCommentsByPost } from '../controllers/comment.controller.js';
const router = Router();

router.get('/:postId', getAllCommentsByPost)
router.post('/:postId', createComment);

export default router;

