import { Router } from 'express';
import { getAllUsers, getProfile, getUserByName, getUsernameByToken, updateProfile } from '../controllers/user.controller.js';
const router = Router();

router.get('/token/username', getUsernameByToken);
router.get('/', getAllUsers);
router.get('/profile',getProfile)
router.get('/:username',getUserByName)
router.put('/update-profile',updateProfile)


export default router;

