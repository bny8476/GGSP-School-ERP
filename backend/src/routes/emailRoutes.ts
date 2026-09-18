import { Router } from 'express';
import {
  getEmails,
  getTemplates,
  getRecipients,
  sendEmailMessage,
  toggleStar,
  deleteEmail,
} from '../controllers/emailController';

const router = Router();

// Routes (can be accessed with or without bearer token for flexible ERP operations)
router.get('/', getEmails);
router.get('/templates', getTemplates);
router.get('/recipients', getRecipients);
router.post('/send', sendEmailMessage);
router.patch('/:id/star', toggleStar);
router.delete('/:id', deleteEmail);

export default router;
