import express from 'express';
import {
  getChildHomework,
  createHomework,
  updateHomeworkStatus,
} from '../controllers/homeworkController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/child/:childId', protect, getChildHomework);
router.patch('/:id/status', protect, updateHomeworkStatus);

router
  .route('/')
  .post(protect, authorize('Teacher', 'Admin', 'SuperAdmin'), createHomework);

export default router;
