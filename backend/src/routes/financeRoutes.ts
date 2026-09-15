import express from 'express';
import { getFees, createFee, updateFee, getExpenses, createExpense } from '../controllers/financeController';
import { protect, authorize } from '../middleware/auth';

import { validate } from '../middleware/validate';
import { createFeeSchema, createExpenseSchema } from '../validators/financeValidator';

const router = express.Router();

// Admins & Accountants can manage finance
const adminAuth = [protect, authorize('Admin', 'SuperAdmin', 'Accountant')];

router.get('/fees', adminAuth, getFees);
router.post('/fees', adminAuth, validate(createFeeSchema), createFee);
router.put('/fees/:id', adminAuth, updateFee);

router.get('/expenses', adminAuth, getExpenses);
router.post('/expenses', adminAuth, validate(createExpenseSchema), createExpense);

export default router;
