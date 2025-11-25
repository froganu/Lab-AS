import { Router } from 'express';
import { editUser, getAllUsers, getProfile, getUserByName, getUserDataByToken, updateProfile } from '../controllers/user.controller.js';
const router = Router();

router.get('/', getAllUsers);
router.get('/profile',getProfile)
router.get('/data', getUserDataByToken)
router.get('/:username',getUserByName)
router.put('/update-profile',updateProfile)
router.put('/edit', editUser)

export default router;

