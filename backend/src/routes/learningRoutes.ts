import { Router } from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth';

import { getLearningMaterials, createLearningMaterial } from '../controllers/learningController';

const router = Router();

router.use(authenticate);

router.get('/', getLearningMaterials);
router.post('/', authorizeRoles('SuperAdmin', 'Admin', 'Teacher'), createLearningMaterial);

export default router;
