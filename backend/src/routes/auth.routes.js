import { Router } from 'express';
import { registerUser, loginUser, isAdmin } from '../controllers/auth.controller.js';
const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/admin', isAdmin)

export default router;

