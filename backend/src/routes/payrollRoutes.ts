import express from 'express';
import { getAll, create, update, remove, downloadPayslip } from '../controllers/payrollController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(authorize('SuperAdmin', 'Admin', 'Principal', 'Accountant'), getAll)
  .post(authorize('SuperAdmin', 'Admin'), create);

router.route('/:id')
  .put(authorize('SuperAdmin', 'Admin'), update)
  .delete(authorize('SuperAdmin', 'Admin'), remove);

router.route('/:id/pdf')
  .get(authorize('SuperAdmin', 'Admin', 'Principal', 'Accountant', 'Teacher'), downloadPayslip);

export default router;
