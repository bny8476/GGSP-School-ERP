import { Router } from 'express';
import { protect } from '../middleware/auth';
import { getChatMessages, sendChatMessage } from '../controllers/chatController';
import {
  getTasks,
  createTask,
  updateTaskStatus,
  getNotes,
  createNote,
  getFiles,
  createFileRecord,
} from '../controllers/appsController';

const router = Router();

// Chat routes
router.get('/chat/messages', protect, getChatMessages);
router.post('/chat/send', protect, sendChatMessage);

// Task routes
router.get('/tasks', protect, getTasks);
router.post('/tasks', protect, createTask);
router.patch('/tasks/:id/status', protect, updateTaskStatus);

// Note routes
router.get('/notes', protect, getNotes);
router.post('/notes', protect, createNote);

// File Manager routes
router.get('/files', protect, getFiles);
router.post('/files', protect, createFileRecord);

export default router;
