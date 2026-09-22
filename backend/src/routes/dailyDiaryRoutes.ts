import express from 'express';
import { getDailyDiaries, saveDailyDiary, getTodayDailyDiary } from '../controllers/dailyDiaryController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/today', protect, getTodayDailyDiary);

router.route('/')
  .get(protect, getDailyDiaries)
  .post(protect, authorize('Admin', 'Teacher', 'SuperAdmin'), saveDailyDiary);

export default router;
