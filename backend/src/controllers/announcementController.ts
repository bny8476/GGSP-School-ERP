import { Request, Response } from 'express';
import Announcement from '../models/Announcement';

// @desc    Get announcements (filtered by role/audience)
// @route   GET /api/announcements
export const getAnnouncements = async (req: Request, res: Response) => {
  try {
    const role = req.user?.role;
    let query: Record<string, unknown> = {};

    // Filter logic:
    // SuperAdmin/Admin sees all
    // Teachers see 'All' and 'Staff'
    // Parents see 'All', 'Parents', and 'Class' (if matches their child, but for now we'll just return 'Parents' & 'All')
    
    if (role === 'Teacher' || role === 'Staff' || role === 'Receptionist') {
      query.audience = { $in: ['All', 'Staff'] };
    } else if (role === 'Parent') {
      query.audience = { $in: ['All', 'Parents', 'Class'] };
      // In a full implementation, we'd further filter by classId matching the parent's children
    }

    const announcements = await Announcement.find(query)
      .populate('createdBy', 'firstName lastName')
      .populate('classId', 'name')
      .sort({ createdAt: -1 });

    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching announcements', error });
  }
};

// @desc    Create an announcement
// @route   POST /api/announcements
export const createAnnouncement = async (req: Request, res: Response) => {
  try {
    const { title, message, audience, classId } = req.body;
    
    const announcement = await Announcement.create({
      title,
      message,
      audience,
      classId: classId || undefined,
      createdBy: req.user?.id,
    });

    const populated = await Announcement.findById(announcement._id)
      .populate('createdBy', 'firstName lastName')
      .populate('classId', 'name');

    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: 'Error creating announcement', error });
  }
};

// @desc    Delete an announcement
// @route   DELETE /api/announcements/:id
export const deleteAnnouncement = async (req: Request, res: Response) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) return res.status(404).json({ message: 'Announcement not found' });
    res.json({ message: 'Announcement removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error deleting announcement', error });
  }
};
