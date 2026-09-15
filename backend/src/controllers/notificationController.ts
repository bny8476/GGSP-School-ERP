import { Request, Response } from 'express';
import Notification from '../models/Notification';
import { getIO } from '../socket';

export const getMyNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const notifications = await Notification.find({
      $or: [{ userId }, { targetRole: userRole }, { targetRole: 'all' }],
    })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      $or: [{ userId }, { targetRole: userRole }, { targetRole: 'all' }],
      read: false,
    });

    res.json({ notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json(notification);
  } catch (error) {
    res.status(400).json({ message: 'Invalid request', error });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    await Notification.updateMany(
      {
        $or: [{ userId }, { targetRole: userRole }, { targetRole: 'all' }],
        read: false,
      },
      { read: true }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const createNotification = async (req: Request, res: Response) => {
  try {
    const notification = await Notification.create(req.body);

    // Emit socket alert
    try {
      const io = getIO();
      io.emit('notification', notification);
    } catch (e) {}

    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ message: 'Invalid payload', error });
  }
};
