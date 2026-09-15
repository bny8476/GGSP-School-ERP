import express from 'express';
import { getStudents, createStudent, updateStudent, deleteStudent, downloadReportCard } from '../controllers/studentController';
import { protect, authorize } from '../middleware/auth';

import { validate } from '../middleware/validate';
import { createStudentSchema, updateStudentSchema } from '../validators/studentValidator';

const router = express.Router();

router.route('/')
  .get(protect, getStudents)
  .post(protect, authorize('Admin', 'SuperAdmin'), validate(createStudentSchema), createStudent);

router.route('/:id')
  .put(protect, authorize('Admin', 'SuperAdmin'), validate(updateStudentSchema), updateStudent)
  .delete(protect, authorize('Admin', 'SuperAdmin'), deleteStudent);

router.get('/:id/report-card', protect, downloadReportCard);

export default router;
