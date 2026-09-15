import express from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/authController';
import { protect } from '../middleware/auth';

import { validate } from '../middleware/validate';
import { registerSchema, loginSchema } from '../validators/authValidator';

const router = express.Router();

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.get('/profile', protect, getUserProfile);

export default router;
