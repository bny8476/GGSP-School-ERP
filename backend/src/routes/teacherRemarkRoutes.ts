import express from 'express';
import {
  getChildRemarks,
  createRemark,
  replyToRemark,
} from '../controllers/teacherRemarkController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/child/:childId', protect, getChildRemarks);
router.post('/:id/reply', protect, replyToRemark);

router
  .route('/')
  .post(protect, authorize('Teacher', 'Admin', 'SuperAdmin'), createRemark);

export default router;
