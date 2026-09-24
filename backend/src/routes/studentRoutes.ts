import express from 'express';
import {
  getStudents,
  getStudentById,
  createStudent,
  previewStudentIdentifiers,
  updateStudent,
  promoteStudent,
  deleteStudent,
  downloadReportCard,
  getStudentEnrollments,
  getStudentParents,
} from '../controllers/studentController';
import { protect, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createStudentSchema, updateStudentSchema } from '../validators/studentValidator';

const router = express.Router();

router.get('/preview-identifiers', protect, previewStudentIdentifiers);

router
  .route('/')
  .get(protect, getStudents)
  .post(
    protect,
    authorize('Admin', 'SuperAdmin', 'Teacher', 'Principal'),
    validate(createStudentSchema),
    createStudent
  );

router
  .route('/:id')
  .get(protect, getStudentById)
  .put(
    protect,
    authorize('Admin', 'SuperAdmin', 'Principal'),
    validate(updateStudentSchema),
    updateStudent
  )
  .patch(
    protect,
    authorize('Admin', 'SuperAdmin', 'Principal'),
    validate(updateStudentSchema),
    updateStudent
  )
  .delete(protect, authorize('Admin', 'SuperAdmin'), deleteStudent);

router.post(
  '/:id/promote',
  protect,
  authorize('Admin', 'SuperAdmin', 'Principal'),
  promoteStudent
);

router.get('/:id/report-card', protect, downloadReportCard);
router.get('/:id/enrollments', protect, getStudentEnrollments);
router.get('/:id/parents', protect, getStudentParents);

export default router;
