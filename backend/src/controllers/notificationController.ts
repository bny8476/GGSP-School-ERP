import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Notification from '../models/Notification';
import { emitToUser, emitToRole, broadcastEvent } from '../socket';

export const getMyNotifications = async (req: Request, res: Response) => {
  if (mongoose.connection.readyState !== 1) {
    res.json({ notifications: [], unreadCount: 0 });
    return;
  }

  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const query: Record<string, any> = {
      $or: [
        { recipient: userId },
        { userId: userId },
        { targetRole: userRole },
        { targetRole: 'all' },
      ],
    };

    if (req.query.unread === 'true') {
      query.read = false;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Notification.countDocuments(query),
      Notification.countDocuments({
        $or: [
          { recipient: userId },
          { userId: userId },
          { targetRole: userRole },
          { targetRole: 'all' },
        ],
        read: false,
      }),
    ]);

    res.json({
      success: true,
      notifications,
      total,
      unreadCount,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications', error });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const notification = await Notification.findOne({
      _id: req.params.id,
      $or: [
        { recipient: userId },
        { userId: userId },
        { targetRole: userRole },
        { targetRole: 'all' },
      ],
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    notification.read = true;
    notification.readAt = new Date();
    await notification.save();

    res.json({ success: true, notification });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid request', error });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    await Notification.updateMany(
      {
        $or: [
          { recipient: userId },
          { userId: userId },
          { targetRole: userRole },
          { targetRole: 'all' },
        ],
        read: false,
      },
      { read: true, readAt: new Date() }
    );

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
};

export const createNotification = async (req: Request, res: Response) => {
  try {
    const { recipient, targetRole, title, message, type, entityType, entityId, priority, link } = req.body;

    const notification = await Notification.create({
      recipient: recipient || req.body.userId,
      userId: recipient || req.body.userId,
      targetRole: targetRole || 'all',
      title,
      message,
      type: type || 'system',
      entityType,
      entityId,
      priority: priority || 'normal',
      link,
    });

    // Targeted socket emission
    if (recipient) {
      emitToUser(String(recipient), 'notification:new', notification);
    } else if (targetRole && targetRole !== 'all') {
      emitToRole(targetRole, 'notification:new', notification);
    } else {
      broadcastEvent('notification:new', notification);
    }

    res.status(201).json({ success: true, notification });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid payload', error });
  }
};
