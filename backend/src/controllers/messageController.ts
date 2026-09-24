import { Request, Response } from 'express';
import mongoose from 'mongoose';
import ChatMessage from '../models/Chat';
import User from '../models/User';
import { emitToUser, emitToRoom } from '../socket';

/**
 * @desc Get list of conversations for current user
 * @route GET /api/v1/messages/conversations
 */
export const getConversations = async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user?.id;
    if (!currentUserId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const currentObjectId = new mongoose.Types.ObjectId(currentUserId);

    // Find all messages involving current user
    const messages = await ChatMessage.find({
      $or: [{ sender: currentObjectId }, { recipient: currentObjectId }],
    })
      .sort({ createdAt: -1 })
      .populate('sender', 'firstName lastName role email')
      .populate('recipient', 'firstName lastName role email')
      .limit(200);

    // Group by other participant
    const conversationMap = new Map<string, any>();

    for (const msg of messages) {
      const senderId = String(msg.sender?._id || msg.sender);
      const recipientId = msg.recipient ? String(msg.recipient?._id || msg.recipient) : null;

      const otherUserId = senderId === currentUserId ? recipientId : senderId;
      if (!otherUserId) continue;

      if (!conversationMap.has(otherUserId)) {
        const otherUser = senderId === currentUserId ? msg.recipient : msg.sender;
        const isUnread =
          String(msg.sender?._id || msg.sender) !== currentUserId &&
          (!msg.readBy || !msg.readBy.some((id: any) => String(id) === currentUserId));

        conversationMap.set(otherUserId, {
          participant: otherUser,
          lastMessage: {
            _id: msg._id,
            message: msg.message,
            createdAt: msg.createdAt,
            sender: msg.sender,
          },
          unreadCount: isUnread ? 1 : 0,
        });
      } else {
        const conv = conversationMap.get(otherUserId);
        const isUnread =
          String(msg.sender?._id || msg.sender) !== currentUserId &&
          (!msg.readBy || !msg.readBy.some((id: any) => String(id) === currentUserId));
        if (isUnread) {
          conv.unreadCount += 1;
        }
      }
    }

    res.json({
      success: true,
      data: Array.from(conversationMap.values()),
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error fetching conversations', error: error.message });
  }
};

/**
 * @desc Get messages between current user and recipient or room
 * @route GET /api/v1/messages
 */
export const getMessages = async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user?.id;
    const { recipientId, room, page = 1, limit = 50 } = req.query;

    if (!currentUserId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    let query: Record<string, any> = {};

    if (room) {
      query.room = room;
    } else if (recipientId && mongoose.Types.ObjectId.isValid(recipientId as string)) {
      query.$or = [
        { sender: currentUserId, recipient: recipientId },
        { sender: recipientId, recipient: currentUserId },
      ];
    } else {
      return res.status(400).json({ success: false, message: 'recipientId or room query param is required' });
    }

    const [messages, total] = await Promise.all([
      ChatMessage.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('sender', 'firstName lastName role email')
        .populate('recipient', 'firstName lastName role email'),
      ChatMessage.countDocuments(query),
    ]);

    // Chronological order for the chat thread
    const chronologicalMessages = messages.reverse();

    res.json({
      success: true,
      data: chronologicalMessages,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error retrieving messages', error: error.message });
  }
};

/**
 * @desc Send a message
 * @route POST /api/v1/messages
 */
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const senderId = req.user?.id;
    const { recipientId, room, message, attachments } = req.body;

    if (!senderId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (!message && (!attachments || attachments.length === 0)) {
      return res.status(400).json({ success: false, message: 'Message content or attachments required' });
    }

    // Role verification: ensure recipient exists if specified
    if (recipientId) {
      if (!mongoose.Types.ObjectId.isValid(recipientId)) {
        return res.status(400).json({ success: false, message: 'Invalid recipient ID' });
      }
      const recipient = await User.findById(recipientId).select('_id isDeleted status');
      if (!recipient || recipient.isDeleted || recipient.status === 'Suspended') {
        return res.status(404).json({ success: false, message: 'Recipient not available or inactive' });
      }
    }

    const newMsg = await ChatMessage.create({
      sender: new mongoose.Types.ObjectId(senderId),
      recipient: recipientId ? new mongoose.Types.ObjectId(recipientId) : undefined,
      room: room || undefined,
      message,
      attachments: attachments || [],
      readBy: [new mongoose.Types.ObjectId(senderId)],
    });

    const populated = await ChatMessage.findById(newMsg._id)
      .populate('sender', 'firstName lastName role email')
      .populate('recipient', 'firstName lastName role email');

    // Deliver via Socket.IO
    if (recipientId) {
      emitToUser(String(recipientId), 'message:new', populated);
    }
    if (room) {
      emitToRoom(room, 'message:new', populated);
    }
    emitToUser(String(senderId), 'message:sent', populated);

    res.status(201).json({ success: true, data: populated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error sending message', error: error.message });
  }
};

/**
 * @desc Mark messages from recipient as read
 * @route PATCH /api/v1/messages/read
 */
export const markMessagesAsRead = async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user?.id;
    const { senderId, room } = req.body;

    if (!currentUserId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const currentObjectId = new mongoose.Types.ObjectId(currentUserId);
    const query: Record<string, any> = {};

    if (senderId) {
      query.sender = new mongoose.Types.ObjectId(senderId);
      query.recipient = currentObjectId;
    } else if (room) {
      query.room = room;
    } else {
      return res.status(400).json({ success: false, message: 'senderId or room is required' });
    }

    query.readBy = { $ne: currentObjectId };

    await ChatMessage.updateMany(query, {
      $addToSet: { readBy: currentObjectId },
    });

    if (senderId) {
      emitToUser(String(senderId), 'message:read', {
        readBy: currentUserId,
        senderId,
      });
    }

    res.json({ success: true, message: 'Messages marked as read' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error marking messages as read', error: error.message });
  }
};

/**
 * @desc Get total unread message count for authenticated user
 * @route GET /api/v1/messages/unread-count
 */
export const getUnreadMessageCount = async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user?.id;
    if (!currentUserId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const currentObjectId = new mongoose.Types.ObjectId(currentUserId);

    const count = await ChatMessage.countDocuments({
      recipient: currentObjectId,
      readBy: { $ne: currentObjectId },
    });

    res.json({ success: true, unreadCount: count });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error getting unread count', error: error.message });
  }
};
