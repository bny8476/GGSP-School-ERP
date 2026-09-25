import { Request, Response } from 'express';
import mongoose from 'mongoose';
import crypto from 'crypto';
import Fee from '../models/Fee';
import Expense from '../models/Expense';
import Parent from '../models/Parent';
import StudentParent from '../models/StudentParent';
import Student from '../models/Student';
import Notification from '../models/Notification';
import env from '../config/env';
import paymentGatewayService from '../services/paymentGatewayService';
import {
  generateNextReceiptNumber,
  generateNextInvoiceNumber,
} from '../services/sequenceService';
import { emitToUser, emitToRole } from '../socket';

// @desc    Get all fees (with role isolation & search/filter/pagination)
// @route   GET /api/finance/fees
export const getFees = async (req: Request, res: Response) => {
  try {
    const { status, studentId, search, page, limit } = req.query;
    let query: Record<string, any> = {};

    // 1. Role-based privacy for Parents
    if (req.user?.role === 'Parent') {
      const parent = await Parent.findOne({ userId: req.user.id });
      if (!parent) {
        return res.status(200).json([]);
      }

      const linkedRecords = await StudentParent.find({ parentId: parent._id }).select('studentId');
      const linkedStudentIds = linkedRecords.map((r) => r.studentId);
      const directStudents = await Student.find({ parentId: parent._id }).select('_id');
      const allStudentIds = [...new Set([...linkedStudentIds.map(String), ...directStudents.map((s) => String(s._id))])];

      if (studentId && !allStudentIds.includes(String(studentId))) {
        return res.status(403).json({ success: false, message: 'Access denied: You cannot view fee records for this student' });
      }

      query.studentId = studentId
        ? new mongoose.Types.ObjectId(String(studentId))
        : { $in: allStudentIds.map((id) => new mongoose.Types.ObjectId(id)) };
    } else if (studentId && mongoose.Types.ObjectId.isValid(String(studentId))) {
      query.studentId = new mongoose.Types.ObjectId(String(studentId));
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      const searchRegex = new RegExp(String(search).trim(), 'i');
      query.$or = [
        { invoiceNumber: searchRegex },
        { title: searchRegex },
        { feeType: searchRegex },
      ];
    }

    if (page) {
      const pageNum = Math.max(1, Number(page));
      const limitNum = Math.max(1, Math.min(100, Number(limit) || 20));
      const skip = (pageNum - 1) * limitNum;

      const [fees, total] = await Promise.all([
        Fee.find(query)
          .sort({ dueDate: 1 })
          .skip(skip)
          .limit(limitNum)
          .populate('studentId', 'firstName lastName grade admissionNumber studentId'),
        Fee.countDocuments(query),
      ]);

      return res.status(200).json({
        success: true,
        data: fees,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      });
    }

    const fees = await Fee.find(query)
      .sort({ dueDate: 1 })
      .populate('studentId', 'firstName lastName grade admissionNumber studentId');

    res.status(200).json(fees);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error fetching fees', error });
  }
};

// @desc    Create a fee invoice
// @route   POST /api/finance/fees
export const createFee = async (req: Request, res: Response) => {
  try {
    const yearStr = new Date().getFullYear().toString();
    const invoiceNumber = req.body.invoiceNumber || (await generateNextInvoiceNumber(yearStr));

    const fee = await Fee.create({
      ...req.body,
      invoiceNumber,
      amountPaid: req.body.amountPaid || 0,
      status: req.body.status || 'Pending',
      paymentHistory: [],
    });

    // Notify parent if student has a linked parent
    if (fee.studentId) {
      const student = await Student.findById(fee.studentId).select('parentId firstName lastName');
      if (student?.parentId) {
        const parent = await Parent.findById(student.parentId).select('userId');
        if (parent?.userId) {
          const formattedDue = new Date(fee.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
          const notif = await Notification.create({
            recipient: parent.userId,
            userId: parent.userId,
            studentId: student._id,
            targetRole: 'Parent',
            title: 'New Fee Invoice Generated',
            message: `Fee invoice ${invoiceNumber} of ₹${fee.totalAmount.toLocaleString('en-IN')} for ${student.firstName} is due by ${formattedDue}.`,
            type: 'fee',
            priority: 'normal',
            link: '/parent/fees',
            metadata: { feeId: fee._id, invoiceNumber, amount: fee.totalAmount, dueDate: fee.dueDate },
          });
          emitToUser(parent.userId.toString(), 'notification:new', notif);
        }
      }
    }

    res.status(201).json({ success: true, message: 'Fee invoice created successfully', fee });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid fee data', error });
  }
};

// @desc    Get all expenses
// @route   GET /api/finance/expenses
export const getExpenses = async (req: Request, res: Response) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error fetching expenses', error });
  }
};

// @desc    Record an expense
// @route   POST /api/finance/expenses
export const createExpense = async (req: Request, res: Response) => {
  try {
    const recordedBy = req.user?.id;
    if (!recordedBy) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }
    const expense = await Expense.create({ ...req.body, recordedBy });
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid expense data', error });
  }
};

// @desc    Update a fee record (strict whitelist to prevent unauthorized mass-assignment)
// @route   PUT /api/finance/fees/:id
export const updateFee = async (req: Request, res: Response) => {
  try {
    const allowedFields = ['feeType', 'dueDate', 'discount', 'fine', 'remarks', 'academicYearId'];
    const sanitizedUpdates: Record<string, any> = {};

    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        sanitizedUpdates[key] = req.body[key];
      }
    }

    if (Object.keys(sanitizedUpdates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid updateable fee fields provided. (Allowed: ' + allowedFields.join(', ') + ')',
      });
    }

    const fee = await Fee.findByIdAndUpdate(req.params.id, sanitizedUpdates, { new: true, runValidators: true });
    if (!fee) return res.status(404).json({ success: false, message: 'Fee record not found' });
    res.status(200).json(fee);
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error updating fee', error });
  }
};

// @desc    Initiate/create payment gateway order for parent fee payment
// @route   POST /api/finance/fees/:id/create-payment-order
export const createPaymentOrder = async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const feeId = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!feeId || !mongoose.Types.ObjectId.isValid(feeId)) {
      return res.status(400).json({ success: false, message: 'Invalid fee invoice ID format' });
    }

    const fee = await Fee.findById(feeId);
    if (!fee) {
      return res.status(404).json({ success: false, message: 'Fee invoice not found' });
    }

    // Role-based child ownership verification for parent
    if (req.user?.role === 'Parent') {
      const parent = await Parent.findOne({ userId: req.user.id });
      if (parent) {
        const isDirectChild = await Student.findOne({ _id: fee.studentId, parentId: parent._id });
        const isJunctionChild = await StudentParent.findOne({ studentId: fee.studentId, parentId: parent._id });
        if (!isDirectChild && !isJunctionChild) {
          return res.status(403).json({ success: false, message: 'Access denied: You cannot create orders for other students' });
        }
      }
    }

    if (fee.status === 'Paid') {
      return res.status(400).json({ success: false, message: 'This fee invoice has already been fully settled' });
    }

    const remainingBalance = Math.max(0, fee.totalAmount - (fee.amountPaid || 0));
    const orderAmount = req.body.amount ? Math.min(Number(req.body.amount), remainingBalance) : remainingBalance;

    const gatewayOrderId = `ORD_${Date.now()}_${Math.floor(Math.random() * 9000 + 1000)}`;
    const orderTimestamp = Date.now();

    // Generate cryptographic order signature
    const orderSignature = crypto
      .createHmac('sha256', env.PAYMENT_GATEWAY_SECRET)
      .update(`${feeId}:${gatewayOrderId}:${orderAmount}`)
      .digest('hex');

    return res.json({
      success: true,
      data: {
        feeId: fee._id,
        gatewayOrderId,
        amount: orderAmount,
        currency: 'INR',
        orderTimestamp,
        orderSignature,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Failed to create payment order', error: error.message });
  }
};

// @desc    Pay / settle fee invoice (Idempotent, strictly validates amounts, payment gateway verification, and authorization)
// @route   POST /api/finance/fees/:id/pay
export const payFee = async (req: Request, res: Response) => {
  try {
    const { amount, paymentMethod = 'Online / UPI', transactionId, gatewayOrderId, gatewaySignature, gatewayPaymentId } = req.body;

    const rawId = req.params.id;
    const feeId = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!feeId || !mongoose.Types.ObjectId.isValid(feeId)) {
      return res.status(400).json({ success: false, message: 'Invalid fee invoice ID format' });
    }

    const fee = await Fee.findById(feeId);
    if (!fee) {
      return res.status(404).json({ success: false, message: 'Fee invoice not found' });
    }

    // Role-based child ownership verification for parent
    if (req.user?.role === 'Parent') {
      const parent = await Parent.findOne({ userId: req.user.id });
      if (parent) {
        const isDirectChild = await Student.findOne({ _id: fee.studentId, parentId: parent._id });
        const isJunctionChild = await StudentParent.findOne({ studentId: fee.studentId, parentId: parent._id });
        if (!isDirectChild && !isJunctionChild) {
          return res.status(403).json({ success: false, message: 'Access denied: You cannot pay fees for other students' });
        }
      }
    }

    // Check if fee is already fully paid
    if (fee.status === 'Paid') {
      return res.status(400).json({
        success: false,
        message: 'This fee invoice has already been fully settled.',
      });
    }

    // SECURITY TRUST BOUNDARY: Check payment origin & enforce gateway verification
    const isStaff = ['Admin', 'SuperAdmin', 'Accountant'].includes(req.user?.role || '');
    const sig = req.body.signature || gatewaySignature;

    if (!isStaff) {
      // Parent online payments strictly require payment gateway verification
      if (!gatewayOrderId || !gatewayPaymentId || !sig) {
        return res.status(400).json({
          success: false,
          message:
            'Missing required payment gateway verification parameters (gatewayOrderId, gatewayPaymentId, signature).',
        });
      }

      const isGatewayVerified = await paymentGatewayService.verifyPayment(gatewayOrderId, gatewayPaymentId, sig);
      if (!isGatewayVerified) {
        return res.status(400).json({
          success: false,
          message: 'Payment verification failed: Invalid cryptographic payment signature from payment gateway.',
        });
      }
    }

    // Apply amount-clamping/idempotency AFTER verification succeeds
    const remainingBalance = Math.max(0, fee.totalAmount - (fee.amountPaid || 0));
    const payAmount = Number(amount) > 0 ? Math.min(Number(amount), remainingBalance) : remainingBalance;

    if (payAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Payment amount must be greater than zero' });
    }

    // Concurrency-safe atomic generation of receipt number
    const yearStr = new Date().getFullYear().toString();
    const receiptNumber = await generateNextReceiptNumber(yearStr);
    const resolvedTxnId =
      transactionId ||
      gatewayPaymentId ||
      `TXN-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`;

    const newAmountPaid = (fee.amountPaid || 0) + payAmount;
    fee.amountPaid = newAmountPaid;
    fee.status = newAmountPaid >= fee.totalAmount ? 'Paid' : 'Partial';
    fee.paidAt = new Date();
    fee.paymentMethod = paymentMethod;
    fee.transactionId = resolvedTxnId;
    fee.receiptNumber = receiptNumber;

    const paymentRecord = {
      receiptNumber,
      amount: payAmount,
      paymentMethod,
      transactionId: resolvedTxnId,
      paidAt: new Date(),
      paidBy: req.user?.id ? new mongoose.Types.ObjectId(req.user.id) : undefined,
    };

    fee.paymentHistory.push(paymentRecord);
    await fee.save();

    // Send receipt notification to parent user
    if (req.user?.id) {
      const student = await Student.findById(fee.studentId).select('firstName lastName');
      const notif = await Notification.create({
        recipient: new mongoose.Types.ObjectId(req.user.id),
        userId: new mongoose.Types.ObjectId(req.user.id),
        studentId: fee.studentId,
        targetRole: 'Parent',
        title: 'Fee Payment Successful',
        message: `Payment of ₹${payAmount.toLocaleString('en-IN')} received for ${student?.firstName || 'Student'}. Receipt No: ${receiptNumber}.`,
        type: 'fee',
        priority: 'normal',
        link: '/parent/fees',
        metadata: { feeId: fee._id, receiptNumber, amount: payAmount, transactionId: resolvedTxnId },
      });
      emitToUser(req.user.id, 'notification:new', notif);
      emitToUser(req.user.id, 'payment:completed', { receiptNumber, amount: payAmount });
    }

    emitToRole('Accountant', 'fee:updated', { feeId: fee._id, receiptNumber, amount: payAmount });
    emitToRole('Admin', 'fee:updated', { feeId: fee._id, receiptNumber, amount: payAmount });

    res.status(200).json({
      success: true,
      message: 'Payment processed successfully',
      fee,
      receipt: {
        receiptNumber,
        paidAmount: payAmount,
        paymentMethod,
        transactionId: resolvedTxnId,
        date: new Date(),
        status: 'Completed',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to process fee payment', error });
  }
};

// @desc    Record manual payment (Admin / Accountant only, for Cash / Cheque / Bank Transfer)
// @route   POST /api/finance/fees/:id/record-manual-payment
export const recordManualPayment = async (req: Request, res: Response) => {
  try {
    const { amount, paymentMethod = 'Cash', transactionId, note, reason } = req.body;
    const auditNote = note || reason;

    if (!auditNote || typeof auditNote !== 'string' || !auditNote.trim()) {
      return res.status(400).json({
        success: false,
        message: 'A mandatory audit note/reason is required to record manual fee payments.',
      });
    }

    const rawId = req.params.id;
    const feeId = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!feeId || !mongoose.Types.ObjectId.isValid(feeId)) {
      return res.status(400).json({ success: false, message: 'Invalid fee invoice ID format' });
    }

    const fee = await Fee.findById(feeId);
    if (!fee) {
      return res.status(404).json({ success: false, message: 'Fee invoice not found' });
    }

    if (fee.status === 'Paid') {
      return res.status(400).json({
        success: false,
        message: 'This fee invoice has already been fully settled.',
      });
    }

    const remainingBalance = Math.max(0, fee.totalAmount - (fee.amountPaid || 0));
    const payAmount = Number(amount) > 0 ? Math.min(Number(amount), remainingBalance) : remainingBalance;

    if (payAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Payment amount must be greater than zero' });
    }

    const yearStr = new Date().getFullYear().toString();
    const receiptNumber = await generateNextReceiptNumber(yearStr);
    const resolvedTxnId =
      transactionId ||
      `MANUAL-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`;

    const newAmountPaid = (fee.amountPaid || 0) + payAmount;
    fee.amountPaid = newAmountPaid;
    fee.status = newAmountPaid >= fee.totalAmount ? 'Paid' : 'Partial';
    fee.paidAt = new Date();
    fee.paymentMethod = paymentMethod;
    fee.transactionId = resolvedTxnId;
    fee.receiptNumber = receiptNumber;

    const paymentRecord = {
      receiptNumber,
      amount: payAmount,
      paymentMethod,
      transactionId: resolvedTxnId,
      paidAt: new Date(),
      paidBy: req.user?.id ? new mongoose.Types.ObjectId(req.user.id) : undefined,
      note: auditNote.trim(),
    };

    fee.paymentHistory.push(paymentRecord);
    await fee.save();

    // Send receipt notification
    const student = await Student.findById(fee.studentId).select('firstName lastName parentId');
    if (student?.parentId) {
      const parentUser = await Parent.findById(student.parentId).select('userId');
      if (parentUser?.userId) {
        const notif = await Notification.create({
          recipient: parentUser.userId,
          userId: parentUser.userId,
          studentId: fee.studentId,
          targetRole: 'Parent',
          title: 'Manual Fee Payment Recorded',
          message: `Manual payment of ₹${payAmount.toLocaleString('en-IN')} recorded for ${student?.firstName || 'Student'}. Receipt No: ${receiptNumber}.`,
          type: 'fee',
          priority: 'normal',
          link: '/parent/fees',
          metadata: { feeId: fee._id, receiptNumber, amount: payAmount, transactionId: resolvedTxnId, note: auditNote.trim() },
        });
        emitToUser(parentUser.userId.toString(), 'notification:new', notif);
      }
    }

    emitToRole('Accountant', 'fee:updated', { feeId: fee._id, receiptNumber, amount: payAmount });
    emitToRole('Admin', 'fee:updated', { feeId: fee._id, receiptNumber, amount: payAmount });

    return res.status(200).json({
      success: true,
      message: 'Manual payment recorded successfully',
      fee,
      receipt: {
        receiptNumber,
        paidAmount: payAmount,
        paymentMethod,
        transactionId: resolvedTxnId,
        date: new Date(),
        status: 'Completed',
        note: auditNote.trim(),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to record manual fee payment', error });
  }
};

