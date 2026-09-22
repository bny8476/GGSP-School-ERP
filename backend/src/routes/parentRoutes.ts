import express from 'express';
import { 
  getParents, 
  createParent, 
  getParentById, 
  updateParent,
  getMyParentProfile,
  updateMyParentProfile
} from '../controllers/parentController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.use(protect);

// Current logged-in parent self-management
router.route('/me')
  .get(getMyParentProfile)
  .put(updateMyParentProfile);

router.route('/')
  .get(authorize('SuperAdmin', 'Admin', 'Principal', 'Teacher'), getParents)
  .post(authorize('SuperAdmin', 'Admin', 'Principal'), createParent);

router.route('/:id')
  .get(authorize('SuperAdmin', 'Admin', 'Principal', 'Teacher'), getParentById)
  .put(authorize('SuperAdmin', 'Admin', 'Principal'), updateParent);

export default router;
