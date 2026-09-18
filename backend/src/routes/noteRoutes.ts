import { Router } from 'express';
import {
  getNotes,
  createNote,
  updateNote,
  togglePinNote,
  addComment,
  deleteNote,
} from '../controllers/noteController';

const router = Router();

// Notes endpoints
router.get('/', getNotes);
router.post('/', createNote);
router.put('/:id', updateNote);
router.patch('/:id/pin', togglePinNote);
router.post('/:id/comments', addComment);
router.delete('/:id', deleteNote);

export default router;
