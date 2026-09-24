import { Router } from 'express';
import {
  getConversations,
  getConversationById,
  createConversation,
  getMessages,
  sendMessage,
  markMessagesAsRead,
  getUnreadMessageCount,
  getContacts,
  uploadAttachment,
} from '../controllers/messageController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

// 1. Conversation Endpoints
router.get('/conversations', getConversations);
router.post('/conversations', createConversation);
router.get('/conversations/:conversationId', getConversationById);

// 2. Conversation Messages & Read State
router.get('/conversations/:conversationId/messages', getMessages);
router.post('/conversations/:conversationId/messages', sendMessage);
router.patch('/conversations/:conversationId/read', markMessagesAsRead);

// 3. Contacts & Metadata
router.get('/contacts', getContacts);
router.get('/unread-count', getUnreadMessageCount);

// 4. Attachments
router.post('/attachments', uploadAttachment);
router.post('/messages/:messageId/attachments', uploadAttachment);

// 5. Canonical / Backward-Compatible Chat Routes
router.get('/', getMessages);
router.post('/', sendMessage);
router.patch('/read', markMessagesAsRead);

export default router;
