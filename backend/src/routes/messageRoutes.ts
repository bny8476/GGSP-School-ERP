import { Router } from 'express';
import {
  getConversations,
  getMessages,
  sendMessage,
  markMessagesAsRead,
  getUnreadMessageCount,
} from '../controllers/messageController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/conversations', getConversations);
router.get('/unread-count', getUnreadMessageCount);
router.get('/', getMessages);
router.post('/', sendMessage);
router.patch('/read', markMessagesAsRead);

export default router;
