import express from 'express';
import { getHostelRooms, createHostelRoom, assignStudentToRoom, deleteHostelRoom } from '../controllers/hostelController';
import { protect, authorize } from '../middleware/auth';
import { logAuditEvent } from '../middleware/auditMiddleware';

const router = express.Router();

router.use(protect);

const adminAuth = authorize('SuperAdmin', 'Admin', 'Principal', 'HostelWarden');

router.route('/')
  .get(getHostelRooms)
  .post(adminAuth, logAuditEvent('Hostel', 'CREATE_ROOM'), createHostelRoom);

router.route('/:id/assign')
  .post(adminAuth, logAuditEvent('Hostel', 'ASSIGN_STUDENT'), assignStudentToRoom);

router.route('/:id')
  .delete(adminAuth, logAuditEvent('Hostel', 'DELETE_ROOM'), deleteHostelRoom);

export default router;
