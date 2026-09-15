import { Request, Response } from 'express';
import ChatMessage from '../models/Chat';

export const getChatMessages = async (req: Request, res: Response) => {
  try {
    const { room, recipientId } = req.query;
    const userId = req.user?.id;

    let query: any = {};
    if (room) {
      query.room = room;
    } else if (recipientId && userId) {
      query.$or = [
        { sender: userId, recipient: recipientId },
        { sender: recipientId, recipient: userId },
      ];
    }

    const messages = await ChatMessage.find(query)
      .populate('sender', 'firstName lastName email role')
      .populate('recipient', 'firstName lastName email role')
      .sort({ createdAt: 1 })
      .limit(100);

    return res.json({ success: true, count: messages.length, data: messages });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const sendChatMessage = async (req: Request, res: Response) => {
  try {
    const { recipientId, room, message, attachments } = req.body;
    const senderId = req.user?.id;

    if (!message && (!attachments || attachments.length === 0)) {
      return res.status(400).json({ success: false, message: 'Message content or attachment required' });
    }

    const newMessage = await ChatMessage.create({
      sender: senderId,
      recipient: recipientId || undefined,
      room: room || undefined,
      message,
      attachments: attachments || [],
      readBy: [senderId],
    });

    const populated = await ChatMessage.findById(newMessage._id)
      .populate('sender', 'firstName lastName email role')
      .populate('recipient', 'firstName lastName email role');

    return res.status(201).json({ success: true, data: populated });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
