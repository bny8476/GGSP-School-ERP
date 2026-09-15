import express from 'express';
import { getSubjects, createSubject, deleteSubject, getTimeTables, saveTimeTable } from '../controllers/academicController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.use(protect);

const staffManageAuth = authorize('SuperAdmin', 'Admin', 'Principal', 'Teacher');

router.route('/subjects')
  .get(getSubjects)
  .post(staffManageAuth, createSubject);

router.route('/subjects/:id')
  .delete(staffManageAuth, deleteSubject);

router.route('/timetables')
  .post(staffManageAuth, saveTimeTable);

router.route('/timetables/:classId')
  .get(getTimeTables);

export default router;
