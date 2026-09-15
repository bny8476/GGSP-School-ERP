import { Request, Response, NextFunction } from 'express';
import VisitorLog from '../models/VisitorLog';
import { ApiError } from '../utils/ApiError';

export const getVisitors = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status } = req.query;
    const filter: any = {};
    if (status) filter.status = String(status);

    const visitors = await VisitorLog.find(filter)
      .populate('registeredBy', 'name role')
      .sort({ checkInTime: -1 });

    res.json({ success: true, count: visitors.length, data: visitors });
  } catch (error) {
    next(error);
  }
};

export const createVisitorPass = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user?._id;
    const passNumber = `VP-${Date.now().toString().slice(-6)}`;
    const visitor = await VisitorLog.create({ ...req.body, passNumber, registeredBy: userId });

    res.status(201).json({ success: true, data: visitor });
  } catch (error) {
    next(error);
  }
};

export const checkoutVisitor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const visitor = await VisitorLog.findById(id);
    if (!visitor) throw new ApiError(404, 'Visitor pass not found');

    visitor.status = 'Checked Out';
    visitor.checkOutTime = new Date();
    await visitor.save();

    res.json({ success: true, data: visitor });
  } catch (error) {
    next(error);
  }
};
