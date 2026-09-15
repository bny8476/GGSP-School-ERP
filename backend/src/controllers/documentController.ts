import { Request, Response } from 'express';
import StudentDocument from '../models/StudentDocument';

export const getStudentDocuments = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.query;
    const filter = studentId ? { studentId: String(studentId) } : {};

    const docs = await StudentDocument.find(filter)
      .populate('studentId', 'firstName lastName admissionNumber grade')
      .populate('verifiedBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const createStudentDocument = async (req: Request, res: Response) => {
  try {
    const doc = await StudentDocument.create(req.body);
    res.status(201).json(doc);
  } catch (error) {
    res.status(400).json({ message: 'Invalid document data', error });
  }
};

export const verifyStudentDocument = async (req: Request, res: Response) => {
  try {
    const { verificationStatus, rejectionReason } = req.body;
    const verifiedBy = req.user?.id;

    const doc = await StudentDocument.findByIdAndUpdate(
      req.params.id,
      {
        verificationStatus,
        rejectionReason,
        verifiedBy,
      },
      { new: true, runValidators: true }
    );

    if (!doc) return res.status(404).json({ message: 'Document not found' });
    res.json(doc);
  } catch (error) {
    res.status(400).json({ message: 'Invalid verification update', error });
  }
};

export const deleteStudentDocument = async (req: Request, res: Response) => {
  try {
    const doc = await StudentDocument.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });
    res.json({ message: 'Document removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
