import express from 'express';
import { getRoles, updateRolePermissions } from '../controllers/roleController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.get('/', authorize('SuperAdmin', 'Admin'), getRoles);
router.put('/:id/permissions', authorize('SuperAdmin'), updateRolePermissions);

export default router;
