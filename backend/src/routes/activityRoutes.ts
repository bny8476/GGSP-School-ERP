import express from 'express';
import {
  getTodayActivities,
  createActivity,
  getAllActivities,
} from '../controllers/activityController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/today', protect, getTodayActivities);

router
  .route('/')
  .get(protect, getAllActivities)
  .post(protect, authorize('Teacher', 'Admin', 'SuperAdmin'), createActivity);

export default router;
