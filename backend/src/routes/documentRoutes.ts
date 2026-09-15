import express from 'express';
import { getStudentDocuments, createStudentDocument, verifyStudentDocument, deleteStudentDocument } from '../controllers/documentController';
import { protect, authorize } from '../middleware/auth';
import { logAuditEvent } from '../middleware/auditMiddleware';

const router = express.Router();

router.use(protect);

const staffAuth = authorize('SuperAdmin', 'Admin', 'Principal', 'Teacher', 'Receptionist');
const verifyAuth = authorize('SuperAdmin', 'Admin', 'Principal');

router.route('/')
  .get(getStudentDocuments)
  .post(staffAuth, logAuditEvent('Documents', 'UPLOAD_DOCUMENT'), createStudentDocument);

router.route('/:id/verify')
  .put(verifyAuth, logAuditEvent('Documents', 'VERIFY_DOCUMENT'), verifyStudentDocument);

router.route('/:id')
  .delete(verifyAuth, logAuditEvent('Documents', 'DELETE_DOCUMENT'), deleteStudentDocument);

export default router;
