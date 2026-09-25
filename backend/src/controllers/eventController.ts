import { Request, Response } from 'express';
import Event from '../models/Event';

export const getAll = async (req: Request, res: Response) => {
  try {
    const items = await Event.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

export const create = async (req: Request, res: Response) => {
  try {
    const item = await Event.create(req.body);
    res.status(201).json(item);
  } catch (error) { res.status(400).json({ message: 'Invalid data', error }); }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { title, type, date, time, audience, description } = req.body;
    const allowedUpdates: Record<string, any> = {};
    if (title !== undefined) allowedUpdates.title = title;
    if (type !== undefined) allowedUpdates.type = type;
    if (date !== undefined) allowedUpdates.date = date;
    if (time !== undefined) allowedUpdates.time = time;
    if (audience !== undefined) allowedUpdates.audience = audience;
    if (description !== undefined) allowedUpdates.description = description;

    const item = await Event.findByIdAndUpdate(req.params.id, allowedUpdates, { new: true, runValidators: true });
    if (!item) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(item);
  } catch (error) { res.status(400).json({ message: 'Invalid data', error }); }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Removed successfully' });
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};
