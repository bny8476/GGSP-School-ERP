import { Request, Response, NextFunction } from 'express';
import LearningMaterial from '../models/LearningMaterial';

export const getLearningMaterials = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { classId, subject, fileType } = req.query;
    const filter: any = {};
    if (classId) filter.classId = String(classId);
    if (subject) filter.subject = String(subject);
    if (fileType) filter.fileType = String(fileType);

    const materials = await LearningMaterial.find(filter)
      .populate('classId', 'name grade')
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: materials.length, data: materials });
  } catch (error) {
    next(error);
  }
};

export const createLearningMaterial = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user?._id;
    const material = await LearningMaterial.create({ ...req.body, uploadedBy: userId });
    res.status(201).json({ success: true, data: material });
  } catch (error) {
    next(error);
  }
};
