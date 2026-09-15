import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth';
import { getSystemSettings, updateSystemSettings } from '../controllers/settingsController';

const router = Router();

router.get('/', protect, getSystemSettings);
router.put('/', protect, adminOnly, updateSystemSettings);

export default router;
