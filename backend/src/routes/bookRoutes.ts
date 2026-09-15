import express from 'express';
import { getBooks, createBook, updateBook, deleteBook } from '../controllers/bookController';
import { protect, authorize } from '../middleware/auth';
import { logAuditEvent } from '../middleware/auditMiddleware';

const router = express.Router();

router.use(protect);

const staffAuth = authorize('SuperAdmin', 'Admin', 'Principal', 'Teacher', 'Librarian');
const adminAuth = authorize('SuperAdmin', 'Admin', 'Principal', 'Librarian');

router.route('/')
  .get(getBooks)
  .post(adminAuth, logAuditEvent('Library', 'CREATE_BOOK'), createBook);

router.route('/:id')
  .put(adminAuth, logAuditEvent('Library', 'UPDATE_BOOK'), updateBook)
  .delete(adminAuth, logAuditEvent('Library', 'DELETE_BOOK'), deleteBook);

export default router;
