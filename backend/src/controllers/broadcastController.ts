import { Request, Response, NextFunction } from 'express';
import EmergencyBroadcast from '../models/EmergencyBroadcast';

export const getActiveBroadcasts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const broadcasts = await EmergencyBroadcast.find({ active: true })
      .populate('createdBy', 'name role')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: broadcasts.length, data: broadcasts });
  } catch (error) {
    next(error);
  }
};

export const createBroadcast = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user?._id;
    const broadcast = await EmergencyBroadcast.create({ ...req.body, createdBy: userId });
    res.status(201).json({ success: true, data: broadcast });
  } catch (error) {
    next(error);
  }
};

export const dismissBroadcast = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const broadcast = await EmergencyBroadcast.findByIdAndUpdate(id, { active: false }, { new: true });
    res.json({ success: true, data: broadcast });
  } catch (error) {
    next(error);
  }
};
