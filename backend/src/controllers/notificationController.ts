import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Notification from '../models/Notification';
import { getIO } from '../socket';

const fallbackNotifications = [
  {
    _id: 'notif-1',
    title: 'GGPS Academic Workspace Online',
    message: 'Welcome to the updated academic portal. All systems are operational.',
    type: 'system',
    priority: 'normal',
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'notif-2',
    title: 'Daily Attendance Reminder',
    message: 'Please complete and verify attendance for LKG - Section A by 10:00 AM.',
    type: 'academic',
    priority: 'high',
    read: false,
    link: '/dashboard',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    _id: 'notif-3',
    title: 'Faculty Briefing',
    message: 'Monthly staff briefing scheduled for 3:30 PM today in Conference Hall A.',
    type: 'event',
    priority: 'normal',
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const getMyNotifications = async (req: Request, res: Response) => {
  // Return instant fallback notifications if MongoDB is not connected
  if (mongoose.connection.readyState !== 1) {
    const unread = fallbackNotifications.filter(n => !n.read).length;
    res.json({ notifications: fallbackNotifications, unreadCount: unread });
    return;
  }

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
    console.warn('Notifications DB warning, serving fallback notifications:', error);
    const unread = fallbackNotifications.filter(n => !n.read).length;
    res.json({ notifications: fallbackNotifications, unreadCount: unread });
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
