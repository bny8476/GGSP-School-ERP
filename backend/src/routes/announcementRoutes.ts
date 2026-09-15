import express from 'express';
import { getAnnouncements, createAnnouncement, deleteAnnouncement } from '../controllers/announcementController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.use(protect);

const staffAuth = authorize('SuperAdmin', 'Admin', 'Principal', 'Teacher');

router.route('/')
  .get(getAnnouncements)
  .post(staffAuth, createAnnouncement);

router.route('/:id')
  .delete(staffAuth, deleteAnnouncement);

export default router;
