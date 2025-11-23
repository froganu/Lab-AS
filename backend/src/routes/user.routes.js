import { Router } from 'express';
import { getAllUsers, getUserByName, getUsernameByToken } from '../controllers/user.controller.js';
const router = Router();

router.get('/', getAllUsers);
router.get('/:username',getUserByName)
router.get('/token/username', getUsernameByToken);

export default router;

