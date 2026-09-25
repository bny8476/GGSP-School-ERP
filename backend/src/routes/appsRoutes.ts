import { Router } from 'express';
import { getChatMessages, sendChatMessage } from '../controllers/chatController';
import {
  getTasks,
  getStaffMembers,
  createTask,
  updateTaskStatus,
  escalateTask,
  triggerERPTasks,
  deleteTask,
  getNotes,
  createNote,
  getFiles,
  createFileRecord,
} from '../controllers/appsController';
import { protect } from '../middleware/auth';

const router = Router();

// Secure all productivity apps endpoints
router.use(protect);

// Chat routes
router.get('/chat/messages', getChatMessages);
router.post('/chat/send', sendChatMessage);

// Task routes (Administrative Delegation & Tracking)
router.get('/tasks', getTasks);
router.get('/tasks/staff', getStaffMembers);
router.post('/tasks', createTask);
router.patch('/tasks/:id/status', updateTaskStatus);
router.patch('/tasks/:id/escalate', escalateTask);
router.post('/tasks/trigger-erp', triggerERPTasks);
router.delete('/tasks/:id', deleteTask);

// Note routes
router.get('/notes', getNotes);
router.post('/notes', createNote);

// File Manager routes
router.get('/files', getFiles);
router.post('/files', createFileRecord);

export default router;
