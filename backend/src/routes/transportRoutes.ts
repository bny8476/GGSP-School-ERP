import express from 'express';
import { getRoutes, createRoute, updateRoute, deleteRoute, getRouteStudents } from '../controllers/transportController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.use(protect);

const staffManageAuth = authorize('SuperAdmin', 'Admin', 'Principal');

router.route('/')
  .get(getRoutes)
  .post(staffManageAuth, createRoute);

router.route('/:id')
  .put(staffManageAuth, updateRoute)
  .delete(staffManageAuth, deleteRoute);

router.route('/:id/students')
  .get(getRouteStudents);

export default router;
