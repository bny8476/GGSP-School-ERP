import { Request, Response } from 'express';
import Campus from '../models/Campus';

export const getCampuses = async (req: Request, res: Response): Promise<void> => {
  try {
    const campuses = await Campus.find().sort({ createdAt: -1 });
    res.json({ success: true, count: campuses.length, campuses });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCampusById = async (req: Request, res: Response): Promise<void> => {
  try {
    const campus = await Campus.findById(req.params.id);
    if (!campus) {
      res.status(404).json({ success: false, message: 'Campus not found' });
      return;
    }
    res.json({ success: true, campus });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCampus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, code, address, city, state, country, contactPhone, email, principalName, workingHours } = req.body;
    const existing = await Campus.findOne({ code: code.toUpperCase() });
    if (existing) {
      res.status(400).json({ success: false, message: `Campus code '${code}' already exists` });
      return;
    }

    const campus = await Campus.create({
      name,
      code: code.toUpperCase(),
      address,
      city,
      state,
      country,
      contactPhone,
      email,
      principalName,
      workingHours: workingHours || '08:00 AM - 04:00 PM',
      isActive: true,
    });

    res.status(201).json({ success: true, campus });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCampus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, address, city, state, country, contactPhone, email, principalName, logoUrl, workingHours, holidays, settings, isActive } = req.body;
    const allowedUpdates: Record<string, any> = {};
    if (name !== undefined) allowedUpdates.name = name;
    if (address !== undefined) allowedUpdates.address = address;
    if (city !== undefined) allowedUpdates.city = city;
    if (state !== undefined) allowedUpdates.state = state;
    if (country !== undefined) allowedUpdates.country = country;
    if (contactPhone !== undefined) allowedUpdates.contactPhone = contactPhone;
    if (email !== undefined) allowedUpdates.email = email;
    if (principalName !== undefined) allowedUpdates.principalName = principalName;
    if (logoUrl !== undefined) allowedUpdates.logoUrl = logoUrl;
    if (workingHours !== undefined) allowedUpdates.workingHours = workingHours;
    if (holidays !== undefined) allowedUpdates.holidays = holidays;
    if (settings !== undefined) allowedUpdates.settings = settings;
    if (isActive !== undefined) allowedUpdates.isActive = isActive;

    const campus = await Campus.findByIdAndUpdate(req.params.id, allowedUpdates, { new: true, runValidators: true });
    if (!campus) {
      res.status(404).json({ success: false, message: 'Campus not found' });
      return;
    }
    res.json({ success: true, campus });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
