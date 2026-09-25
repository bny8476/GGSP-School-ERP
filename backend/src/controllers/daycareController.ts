import { Request, Response } from 'express';
import DayCareLog from '../models/DayCareLog';

export const getAll = async (req: Request, res: Response) => {
  try {
    const items = await DayCareLog.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

export const create = async (req: Request, res: Response) => {
  try {
    const item = await DayCareLog.create(req.body);
    res.status(201).json(item);
  } catch (error) { res.status(400).json({ message: 'Invalid data', error }); }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { date, checkInTime, checkOutTime, foodTracking, sleepTracking, notes } = req.body;
    const allowedUpdates: Record<string, any> = {};
    if (date !== undefined) allowedUpdates.date = date;
    if (checkInTime !== undefined) allowedUpdates.checkInTime = checkInTime;
    if (checkOutTime !== undefined) allowedUpdates.checkOutTime = checkOutTime;
    if (foodTracking !== undefined) allowedUpdates.foodTracking = foodTracking;
    if (sleepTracking !== undefined) allowedUpdates.sleepTracking = sleepTracking;
    if (notes !== undefined) allowedUpdates.notes = notes;

    const item = await DayCareLog.findByIdAndUpdate(req.params.id, allowedUpdates, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'DayCare log not found' });
    res.json(item);
  } catch (error) { res.status(400).json({ message: 'Invalid data', error }); }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await DayCareLog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Removed successfully' });
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};
