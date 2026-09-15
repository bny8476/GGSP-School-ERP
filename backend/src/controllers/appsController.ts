import { Request, Response } from 'express';
import Task from '../models/Task';
import Note from '../models/Note';
import FileRecord from '../models/FileRecord';
import Event from '../models/Event';

// --- TASKS ---
export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const tasks = await Task.find({ $or: [{ createdBy: userId }, { assignedTo: userId }] })
      .populate('assignedTo', 'firstName lastName email')
      .sort({ createdAt: -1 });
    return res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, assignedTo, dueDate, priority, category, tags } = req.body;
    const userId = req.user?.id;

    const task = await Task.create({
      title,
      description,
      assignedTo: assignedTo || undefined,
      createdBy: userId,
      dueDate,
      priority: priority || 'Medium',
      category: category || 'General',
      tags: tags || [],
    });

    return res.status(201).json({ success: true, data: task });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTaskStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const task = await Task.findByIdAndUpdate(id, { status }, { new: true });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    return res.json({ success: true, data: task });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// --- NOTES ---
export const getNotes = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const notes = await Note.find({ author: userId }).sort({ isPinned: -1, createdAt: -1 });
    return res.json({ success: true, count: notes.length, data: notes });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createNote = async (req: Request, res: Response) => {
  try {
    const { title, content, isPinned, tags, color } = req.body;
    const userId = req.user?.id;

    const note = await Note.create({
      title,
      content,
      author: userId,
      isPinned: isPinned || false,
      tags: tags || [],
      color: color || '#FFFFFF',
    });

    return res.status(201).json({ success: true, data: note });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// --- FILE MANAGER ---
export const getFiles = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const files = await FileRecord.find({ $or: [{ uploadedBy: userId }, { isPublic: true }] }).sort({ createdAt: -1 });
    return res.json({ success: true, count: files.length, data: files });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createFileRecord = async (req: Request, res: Response) => {
  try {
    const { name, originalName, mimeType, size, url, folder, isPublic } = req.body;
    const userId = req.user?.id;

    const file = await FileRecord.create({
      name,
      originalName,
      mimeType,
      size,
      url,
      folder: folder || 'General',
      uploadedBy: userId,
      isPublic: isPublic || false,
    });

    return res.status(201).json({ success: true, data: file });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
