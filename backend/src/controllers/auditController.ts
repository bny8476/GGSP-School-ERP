import { Request, Response } from 'express';
import AuditLog from '../models/AuditLog';

export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const { module: moduleQuery, action, userId } = req.query;

    const filter: any = {};
    if (moduleQuery) filter.module = moduleQuery;
    if (action) filter.action = action;
    if (userId) filter.userId = userId;

    const logs = await AuditLog.find(filter)
      .populate('userId', 'firstName lastName email role')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
