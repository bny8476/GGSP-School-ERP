import express from 'express';
import { getAll, create, update, remove } from '../controllers/daycareController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.use(protect);
const staffAuth = authorize('SuperAdmin', 'Admin', 'Principal', 'Teacher');

router.route('/')
  .get(getAll)
  .post(staffAuth, create);

router.route('/:id')
  .put(staffAuth, update)
  .delete(authorize('SuperAdmin', 'Admin', 'Principal'), remove);

export default router;
