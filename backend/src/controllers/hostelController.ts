import { Request, Response } from 'express';
import HostelRoom from '../models/Hostel';

export const getHostelRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await HostelRoom.find().populate('assignedStudents', 'firstName lastName admissionNumber grade');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const createHostelRoom = async (req: Request, res: Response) => {
  try {
    const room = await HostelRoom.create(req.body);
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data or duplicate room number', error });
  }
};

export const assignStudentToRoom = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.body;
    const room = await HostelRoom.findById(req.params.id);

    if (!room) return res.status(404).json({ message: 'Hostel room not found' });

    if (room.occupancy >= room.capacity) {
      return res.status(409).json({ message: `Over-allocation Error: Room ${room.roomNumber} has reached max capacity (${room.capacity}).` });
    }

    if (!room.assignedStudents.includes(studentId)) {
      room.assignedStudents.push(studentId);
      room.occupancy = room.assignedStudents.length;
      await room.save();
    }

    res.json(room);
  } catch (error) {
    res.status(400).json({ message: 'Invalid assignment payload', error });
  }
};

export const deleteHostelRoom = async (req: Request, res: Response) => {
  try {
    const room = await HostelRoom.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json({ message: 'Hostel room removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
