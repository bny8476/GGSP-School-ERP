import express from 'express';
import { getLeaves, createLeave, updateLeaveStatus } from '../controllers/leaveController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getLeaves)
  .post(createLeave);

router.route('/:id')
  .put(authorize('SuperAdmin', 'Admin', 'Principal', 'Teacher'), updateLeaveStatus);

export default router;
