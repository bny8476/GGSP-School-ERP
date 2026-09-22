import express from 'express';
import { getFees, createFee, updateFee, getExpenses, createExpense, payFee } from '../controllers/financeController';
import { protect, authorize } from '../middleware/auth';

import { validate } from '../middleware/validate';
import { createFeeSchema, createExpenseSchema } from '../validators/financeValidator';

const router = express.Router();

// Admins & Accountants can manage finance, Parents can view their fees and pay invoices
const adminAuth = [protect, authorize('Admin', 'SuperAdmin', 'Accountant')];
const feeViewAuth = [protect, authorize('Admin', 'SuperAdmin', 'Accountant', 'Parent')];

router.get('/fees', feeViewAuth, getFees);
router.post('/fees', adminAuth, validate(createFeeSchema), createFee);
router.put('/fees/:id', adminAuth, updateFee);
router.post('/fees/:id/pay', feeViewAuth, payFee);

router.get('/expenses', adminAuth, getExpenses);
router.post('/expenses', adminAuth, validate(createExpenseSchema), createExpense);

export default router;
