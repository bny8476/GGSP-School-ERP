import express from 'express';
import { getAttendance, markAttendance, getTodayAttendance } from '../controllers/attendanceController';
import { protect, authorize } from '../middleware/auth';

import { validate } from '../middleware/validate';
import { markAttendanceSchema } from '../validators/attendanceValidator';

const router = express.Router();

const staffAuth = [protect, authorize('Admin', 'Teacher', 'SuperAdmin')];

router.get('/today', protect, getTodayAttendance);

router.route('/')
  .get(protect, getAttendance)
  .post(staffAuth, validate(markAttendanceSchema), markAttendance);

export default router;
