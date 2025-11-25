import { Router } from 'express';
import { registerUser, loginUser, authLoginUser } from '../controllers/auth.controller.js';
const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/oauth-login', authLoginUser); 

export default router;
