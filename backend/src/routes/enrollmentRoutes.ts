import express from 'express';
import {
  getEnrollments,
  assignEnrollment,
  bulkRollover,
  getSectionCapacities,
  updateSectionCapacity,
} from '../controllers/enrollmentController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/', protect, getEnrollments);
router.post('/assign', protect, authorize('Admin', 'SuperAdmin', 'Principal'), assignEnrollment);
router.post('/bulk-rollover', protect, authorize('Admin', 'SuperAdmin', 'Principal'), bulkRollover);
router.get('/capacity', protect, getSectionCapacities);
router.put('/capacity/:sectionId', protect, authorize('Admin', 'SuperAdmin', 'Principal'), updateSectionCapacity);

export default router;
