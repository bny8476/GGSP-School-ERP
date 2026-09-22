import express from 'express';
import {
  getTodayClassWork,
  createClassWork,
  getClassWorkHistory,
} from '../controllers/classWorkController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/today', protect, getTodayClassWork);

router
  .route('/')
  .get(protect, getClassWorkHistory)
  .post(protect, authorize('Teacher', 'Admin', 'SuperAdmin'), createClassWork);

export default router;
