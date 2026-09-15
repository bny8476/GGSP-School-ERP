import { Request, Response } from 'express';
import SystemSettings from '../models/Settings';

export const getSystemSettings = async (req: Request, res: Response) => {
  try {
    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = await SystemSettings.create({
        schoolName: 'Global International School',
        schoolTagline: 'Excellence in Education',
        schoolEmail: 'contact@globalinternationalschool.edu',
        schoolPhone: '+1 (800) 555-GLOBAL',
        schoolAddress: '123 Education Boulevard, Knowledge City',
        academicYear: '2026-2027',
        currency: 'USD',
        timezone: 'UTC',
        language: 'en',
      });
    }
    return res.json({ success: true, data: settings });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSystemSettings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    let settings = await SystemSettings.findOne();

    if (settings) {
      Object.assign(settings, req.body, { updatedBy: userId });
      await settings.save();
    } else {
      settings = await SystemSettings.create({ ...req.body, updatedBy: userId });
    }

    return res.json({ success: true, message: 'Settings updated successfully', data: settings });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
