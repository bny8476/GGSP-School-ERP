import { Router } from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth';

import { getActiveBroadcasts, createBroadcast, dismissBroadcast } from '../controllers/broadcastController';

const router = Router();

router.use(authenticate);

router.get('/active', getActiveBroadcasts);
router.post('/', authorizeRoles('SuperAdmin', 'Admin'), createBroadcast);
router.patch('/:id/dismiss', authorizeRoles('SuperAdmin', 'Admin'), dismissBroadcast);

export default router;
