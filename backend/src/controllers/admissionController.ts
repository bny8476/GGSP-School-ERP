import { Request, Response } from 'express';
import Admission from '../models/Admission';

// @desc    Get all admissions
// @route   GET /api/admissions
export const getAdmissions = async (req: Request, res: Response) => {
  try {
    const { stage, status } = req.query;
    const filter: any = {};
    if (stage) filter.stage = stage;
    if (status) filter.status = status;

    const admissions = await Admission.find(filter).sort({ createdAt: -1 });
    res.status(200).json(admissions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Create an enquiry/admission
// @route   POST /api/admissions
export const createAdmission = async (req: Request, res: Response) => {
  try {
    const count = await Admission.countDocuments();
    const applicationNumber = req.body.applicationNumber || `APP-${new Date().getFullYear()}-${String(count + 1001).padStart(5, '0')}`;

    const admission = await Admission.create({
      ...req.body,
      applicationNumber,
    });

    res.status(201).json(admission);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error });
  }
};

// @desc    Update admission stage/details
// @route   PUT /api/admissions/:id
export const updateAdmission = async (req: Request, res: Response) => {
  try {
    const admission = await Admission.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    
    if (!admission) {
      return res.status(404).json({ message: 'Admission record not found' });
    }
    
    res.status(200).json(admission);
  } catch (error) {
    res.status(400).json({ message: 'Invalid update data', error });
  }
};
