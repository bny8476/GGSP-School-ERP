import express from 'express';
import { getMyNotifications, markAsRead, markAllAsRead, createNotification } from '../controllers/notificationController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getMyNotifications)
  .post(authorize('SuperAdmin', 'Admin', 'Principal', 'Teacher'), createNotification);

router.put('/mark-all-read', markAllAsRead);
router.put('/:id/read', markAsRead);

export default router;
