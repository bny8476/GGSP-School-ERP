import { Router } from 'express';
import {
  getEmails,
  getTemplates,
  getRecipients,
  sendEmailMessage,
  toggleStar,
  deleteEmail,
} from '../controllers/emailController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Secure email routes: require authenticated session
router.use(protect);

router.get('/', getEmails);
router.get('/templates', getTemplates);
router.get('/recipients', getRecipients);
router.post('/send', authorize('SuperAdmin', 'Admin', 'Principal', 'Teacher', 'Staff', 'Accountant'), sendEmailMessage);
router.patch('/:id/star', toggleStar);
router.delete('/:id', authorize('SuperAdmin', 'Admin', 'Principal'), deleteEmail);

export default router;
