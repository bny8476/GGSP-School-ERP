import express from 'express';
import { getFeeDefaulters, getAdmissionAnalytics, getAttendanceSummary } from '../controllers/reportController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.use(protect);

const adminStaffAuth = authorize('SuperAdmin', 'Admin', 'Principal', 'Accountant');

router.get('/fee-defaulters', adminStaffAuth, getFeeDefaulters);
router.get('/admissions', adminStaffAuth, getAdmissionAnalytics);
router.get('/attendance', authorize('SuperAdmin', 'Admin', 'Principal', 'Accountant', 'Teacher'), getAttendanceSummary);

export default router;
