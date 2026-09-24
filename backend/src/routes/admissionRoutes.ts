import express from 'express';
import {
  getAdmissions,
  createAdmission,
  updateAdmission,
  approveAdmission,
} from '../controllers/admissionController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Public route for parents submitting enquiries online
router.post('/', createAdmission);

// Protected routes for staff
const staffAuth = [protect, authorize('Admin', 'Receptionist', 'SuperAdmin', 'Principal')];

router.get('/', staffAuth, getAdmissions);
router.put('/:id', staffAuth, updateAdmission);
router.post('/:id/approve', staffAuth, approveAdmission);

export default router;
