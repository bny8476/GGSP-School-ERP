import { Request, Response } from 'express';
import Ticket from '../models/Ticket';

export const getTickets = async (req: Request, res: Response) => {
  try {
    const userRole = req.user?.role;
    const userId = req.user?.id;

    // Staff/Admin sees all tickets; Parents/Students see only their own
    const isStaff = ['SuperAdmin', 'Admin', 'Principal', 'Receptionist', 'Teacher'].includes(userRole || '');
    const query = isStaff ? {} : { userId };

    const tickets = await Ticket.find(query)
      .populate('userId', 'firstName lastName email')
      .populate('assignedTo', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const createTicket = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const count = await Ticket.countDocuments();
    const ticketNumber = `TKT-${String(count + 1001).padStart(5, '0')}`;

    const ticket = await Ticket.create({
      ...req.body,
      userId,
      ticketNumber,
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(400).json({ message: 'Invalid ticket data', error });
  }
};

export const addTicketResponse = async (req: Request, res: Response) => {
  try {
    const { message, status } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    ticket.responses = ticket.responses || [];
    ticket.responses.push({
      senderId: req.user?.id as any,
      senderName: `User:${req.user?.id}`,
      message,
      createdAt: new Date(),
    });

    if (status) {
      ticket.status = status;
    }

    await ticket.save();
    res.json(ticket);
  } catch (error) {
    res.status(400).json({ message: 'Invalid response payload', error });
  }
};

export const updateTicketStatus = async (req: Request, res: Response) => {
  try {
    const { status, assignedTo } = req.body;
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status, assignedTo },
      { new: true, runValidators: true }
    );
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.json(ticket);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data', error });
  }
};
