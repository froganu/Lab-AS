import { Router } from 'express';
import { getAllUsers, getUserByName } from '../controllers/user.controller.js';
const router = Router();

router.get('/', getAllUsers);
router.get('/:username',getUserByName)

export default router;

