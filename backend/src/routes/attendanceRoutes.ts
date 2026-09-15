import express from 'express';
import { getAttendance, markAttendance } from '../controllers/attendanceController';
import { protect, authorize } from '../middleware/auth';

import { validate } from '../middleware/validate';
import { markAttendanceSchema } from '../validators/attendanceValidator';

const router = express.Router();

const staffAuth = [protect, authorize('Admin', 'Teacher', 'SuperAdmin')];

router.route('/')
  .get(protect, getAttendance)
  .post(staffAuth, validate(markAttendanceSchema), markAttendance);

export default router;
