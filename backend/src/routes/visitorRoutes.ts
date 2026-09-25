import { Router } from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth';

import { getVisitors, createVisitorPass, checkoutVisitor } from '../controllers/visitorController';

const router = Router();

router.use(authenticate);

router.get('/', getVisitors);
router.post('/', authorizeRoles('SuperAdmin', 'Admin', 'Receptionist', 'Security'), createVisitorPass);
router.patch('/:id/checkout', authorizeRoles('SuperAdmin', 'Admin', 'Receptionist', 'Security'), checkoutVisitor);

export default router;
