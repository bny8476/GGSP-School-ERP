import { Request, Response } from 'express';
import Payroll from '../models/Payroll';
import User from '../models/User';
import { generatePayslipPDF } from '../utils/pdfGenerator';

export const getAll = async (req: Request, res: Response) => {
  try {
    const items = await Payroll.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) { 
    res.status(500).json({ message: 'Server error' }); 
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const item = await Payroll.create(req.body);
    res.status(201).json(item);
  } catch (error) { 
    res.status(400).json({ message: 'Invalid data', error }); 
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { month, baseSalary, attendanceDays, deductions, bonuses, netSalary, status, paymentDate } = req.body;
    const allowedUpdates: Record<string, any> = {};
    if (month !== undefined) allowedUpdates.month = month;
    if (baseSalary !== undefined) allowedUpdates.baseSalary = baseSalary;
    if (attendanceDays !== undefined) allowedUpdates.attendanceDays = attendanceDays;
    if (deductions !== undefined) allowedUpdates.deductions = deductions;
    if (bonuses !== undefined) allowedUpdates.bonuses = bonuses;
    if (netSalary !== undefined) allowedUpdates.netSalary = netSalary;
    if (status !== undefined) allowedUpdates.status = status;
    if (paymentDate !== undefined) allowedUpdates.paymentDate = paymentDate;

    const item = await Payroll.findByIdAndUpdate(req.params.id, allowedUpdates, { new: true, runValidators: true });
    if (!item) {
      return res.status(404).json({ message: 'Payroll record not found' });
    }
    res.json(item);
  } catch (error) { 
    res.status(400).json({ message: 'Invalid data', error }); 
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await Payroll.findByIdAndDelete(req.params.id);
    res.json({ message: 'Removed successfully' });
  } catch (error) { 
    res.status(500).json({ message: 'Server error' }); 
  }
};

export const downloadPayslip = async (req: Request, res: Response) => {
  try {
    // Populate the staffId so we have their name
    const payrollItem = await Payroll.findById(req.params.id);
    if (!payrollItem) {
      return res.status(404).json({ message: 'Payroll record not found' });
    }

    // Ownership check: staff member can only download their own payslip unless privileged role
    const privilegedRoles = ['SuperAdmin', 'Admin', 'Principal', 'Accountant'];
    const isPrivileged = privilegedRoles.includes(req.user?.role || '');
    const isOwner = payrollItem.staffId?.toString() === req.user?.id;

    if (!isPrivileged && !isOwner) {
      return res.status(403).json({
        message: 'Access denied: You do not have permission to view or download this payslip.',
      });
    }

    // Attempt to fetch user data to pass to PDF
    const user = await User.findById(payrollItem.staffId);
    const enrichedData = {
      ...payrollItem.toObject(),
      staffId: user ? { firstName: user.firstName, lastName: user.lastName } : { firstName: 'Unknown', lastName: 'Staff' }
    };

    // The utility will pipe directly to `res`
    generatePayslipPDF(res, enrichedData);
  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).json({ message: 'Failed to generate PDF' });
  }
};
