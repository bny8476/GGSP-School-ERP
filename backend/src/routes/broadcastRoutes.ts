import { Router } from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth';

import { getActiveBroadcasts, createBroadcast, dismissBroadcast } from '../controllers/broadcastController';

const router = Router();

router.use(authenticate);

router.get('/active', getActiveBroadcasts);
router.post('/', authorizeRoles('Super Admin', 'Admin'), createBroadcast);
router.patch('/:id/dismiss', authorizeRoles('Super Admin', 'Admin'), dismissBroadcast);

export default router;
