import express from 'express';
import { getAuditLogs } from '../controllers/auditController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.use(protect);
router.use(authorize('SuperAdmin', 'Admin', 'Principal'));

router.get('/', getAuditLogs);

export default router;
