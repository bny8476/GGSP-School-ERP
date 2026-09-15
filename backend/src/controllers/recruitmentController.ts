import { Request, Response, NextFunction } from 'express';
import Recruitment from '../models/Recruitment';
import { ApiError } from '../utils/ApiError';

export const getJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const jobs = await Recruitment.find().sort({ createdAt: -1 });
    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    next(error);
  }
};

export const createJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user?._id;
    const job = await Recruitment.create({ ...req.body, createdBy: userId });
    res.status(201).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

export const applyForJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, phone, resumeUrl } = req.body;

    const job = await Recruitment.findById(id);
    if (!job) throw new ApiError(404, 'Job opening not found');

    job.applicants.push({
      name,
      email,
      phone,
      resumeUrl,
      status: 'Applied',
      appliedDate: new Date(),
    });

    await job.save();
    res.status(201).json({ success: true, message: 'Application submitted successfully', data: job });
  } catch (error) {
    next(error);
  }
};

export const updateApplicantStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id, applicantId } = req.params;
    const { status, notes } = req.body;

    const job = await Recruitment.findById(id);
    if (!job) throw new ApiError(404, 'Job opening not found');

    const applicant = (job.applicants as any).id(applicantId);
    if (!applicant) throw new ApiError(404, 'Applicant not found');

    if (status) applicant.status = status;
    if (notes) applicant.notes = notes;

    await job.save();
    res.json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};
