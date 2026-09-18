import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Task, { ITask } from '../models/Task';
import Note from '../models/Note';
import FileRecord from '../models/FileRecord';
import User from '../models/User';
import Notification from '../models/Notification';
import { getIO } from '../socket';

// Default assignable staff members (used if DB offline or for rapid autocomplete)
export const DEFAULT_STAFF_MEMBERS = [
  { id: 'u1', name: 'Dr. Marcus Vance', role: 'Principal', department: 'Leadership', email: 'principal@globalinternationalschool.edu' },
  { id: 'u2', name: 'Sarah Jenkins', role: 'Head of Mathematics', department: 'Academics', email: 's.jenkins@globalinternationalschool.edu' },
  { id: 'u3', name: 'David Chen', role: 'Physics Faculty - Grade 10', department: 'Academics', email: 'd.chen@globalinternationalschool.edu' },
  { id: 'u4', name: 'Robert Taylor', role: 'Chief Finance Officer', department: 'Finance', email: 'bursar@globalinternationalschool.edu' },
  { id: 'u5', name: 'Elena Rostova', role: 'Dean of Students & Discipline', department: 'Student Welfare', email: 'e.rostova@globalinternationalschool.edu' },
  { id: 'u6', name: 'Ahmed Al-Mansoor', role: 'Transport Operations Manager', department: 'Transport', email: 'transport@globalinternationalschool.edu' },
  { id: 'u7', name: 'Michael Chang', role: 'Head of Campus Safety & Maintenance', department: 'Operations', email: 'safety@globalinternationalschool.edu' },
  { id: 'u8', name: 'Claire Bennett', role: 'Chief Examination Controller', department: 'Assessments', email: 'exams@globalinternationalschool.edu' },
];

// Initial seeded tasks with staff delegation and ERP triggers
const INITIAL_TASKS: any[] = [
  {
    _id: 'task_1',
    id: 'task_1',
    title: 'Review Grade 10 Mid-Term Exam Question Papers',
    description: 'Check syllabus alignment, moderation criteria, and finalize question papers for Grade 10 Mid-Term Exams.',
    category: 'Academic',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 days
    dateString: 'Sep 20, 2026',
    priority: 'High',
    status: 'In Progress',
    assigneeName: 'Sarah Jenkins',
    assigneeRole: 'Head of Mathematics',
    department: 'Academics',
    assignedByName: 'Super Admin',
    slaHours: 48,
    isEscalated: false,
    icon: '📄',
    completed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
  },
  {
    _id: 'task_2',
    id: 'task_2',
    title: 'Audit Fee Refund Request #402 for Student Samuel Green',
    description: 'Automated ERP Trigger: Parent requested tuition fee reconciliation following family relocation. Verify bank receipt and approvals.',
    category: 'Finance',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 18), // 18 hours
    dateString: 'Sep 19, 2026',
    priority: 'Urgent',
    status: 'Assigned',
    assigneeName: 'Robert Taylor',
    assigneeRole: 'Chief Finance Officer',
    department: 'Finance',
    assignedByName: 'Super Admin',
    slaHours: 24,
    isEscalated: false,
    erpTriggerSource: 'ERP Finance Trigger: Refund Request #402',
    icon: '💳',
    completed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
  },
  {
    _id: 'task_3',
    id: 'task_3',
    title: 'Investigate Grade 8 Student Leo Harrison (5 Consecutive Absences)',
    description: 'Automated ERP Trigger: Attendance register flagged 5 unexcused sick leaves. Contact parent and schedule welfare evaluation.',
    category: 'Academic',
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 4), // Overdue
    dateString: 'Sep 17, 2026',
    priority: 'Urgent',
    status: 'Escalated',
    assigneeName: 'Elena Rostova',
    assigneeRole: 'Dean of Students & Discipline',
    department: 'Student Welfare',
    assignedByName: 'Super Admin',
    slaHours: 24,
    isEscalated: true,
    escalationReason: 'SLA Breached: No parent contact recorded within 24 hours of 5th absence.',
    erpTriggerSource: 'ERP Attendance Trigger: Chronic Absence Alert #G8-091',
    icon: '🚨',
    completed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36),
  },
  {
    _id: 'task_4',
    id: 'task_4',
    title: 'Submit Monthly Attendance & Payroll Verification Report',
    description: 'Compile verified biometric logs, approved overtime slips, and cross-check with HR payroll ledger.',
    category: 'Administration',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 48), // 2 days
    dateString: 'Sep 20, 2026',
    priority: 'High',
    status: 'Pending Review',
    assigneeName: 'Dr. Marcus Vance',
    assigneeRole: 'Principal',
    department: 'Leadership',
    assignedByName: 'Super Admin',
    slaHours: 72,
    isEscalated: false,
    icon: '👥',
    completed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20),
  },
  {
    _id: 'task_5',
    id: 'task_5',
    title: 'Approve Student Transportation Route Change Request for Route #14',
    description: 'Parent requested re-routing North Campus shuttle to include West End stop for 6 newly enrolled students.',
    category: 'Transport',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 72), // 3 days
    dateString: 'Sep 22, 2026',
    priority: 'Medium',
    status: 'Completed',
    assigneeName: 'Ahmed Al-Mansoor',
    assigneeRole: 'Transport Operations Manager',
    department: 'Transport',
    assignedByName: 'Super Admin',
    slaHours: 48,
    isEscalated: false,
    icon: '🚌',
    completed: true,
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 50),
  },
  {
    _id: 'task_6',
    id: 'task_6',
    title: 'Quarterly Fire & Safety Drill Inspection and Extinguisher Certification',
    description: 'Automated ERP Trigger: State regulatory audit requires certified inspection of building A, B and laboratory safety valves.',
    category: 'Administration',
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 96), // 4 days
    dateString: 'Sep 24, 2026',
    priority: 'Medium',
    status: 'Assigned',
    assigneeName: 'Michael Chang',
    assigneeRole: 'Head of Campus Safety & Maintenance',
    department: 'Operations',
    assignedByName: 'Super Admin',
    slaHours: 96,
    isEscalated: false,
    erpTriggerSource: 'ERP Operations Trigger: Statutory Safety Cycle #Q3-2026',
    icon: '🚒',
    completed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
  },
];

// Fallback in-memory store for tasks
let inMemoryTasks: any[] = [...INITIAL_TASKS];

// Helper to safely emit via Socket.IO
const emitSocketSafe = (event: string, payload: any) => {
  try {
    const io = getIO();
    if (io) {
      io.emit(event, payload);
    }
  } catch (e) {
    // Socket server not ready or uninitialized
  }
};

// --- TASKS CONTROLLERS ---

// @desc    Get all school operational tasks
// @route   GET /api/apps/tasks
export const getTasks = async (req: Request, res: Response) => {
  try {
    const { status, priority, category, search, tab } = req.query;

    let tasks: any[] = [];
    if (mongoose.connection.readyState === 1) {
      try {
        let filter: any = {};
        if (category && category !== 'All Categories') filter.category = category;
        if (priority && priority !== 'All Priorities') filter.priority = priority;
        if (status && status !== 'All Statuses') filter.status = status;

        if (search) {
          const searchRegex = new RegExp(String(search), 'i');
          filter.$or = [
            { title: searchRegex },
            { description: searchRegex },
            { assigneeName: searchRegex },
            { category: searchRegex },
          ];
        }

        tasks = await Task.find(filter)
          .populate('assignedTo', 'firstName lastName email')
          .sort({ createdAt: -1 });
      } catch (dbErr) {
        tasks = inMemoryTasks;
      }
    } else {
      tasks = inMemoryTasks;
    }

    if (!tasks || tasks.length === 0) {
      tasks = inMemoryTasks;
    }

    // Apply in-memory filtering if needed
    let filtered = [...tasks];
    if (category && category !== 'All Categories') {
      filtered = filtered.filter((t) => t.category?.toLowerCase() === String(category).toLowerCase());
    }
    if (priority && priority !== 'All Priorities') {
      filtered = filtered.filter((t) => t.priority?.toLowerCase() === String(priority).toLowerCase());
    }
    if (status && status !== 'All Statuses') {
      filtered = filtered.filter((t) => t.status?.toLowerCase() === String(status).toLowerCase());
    }
    if (search) {
      const q = String(search).toLowerCase();
      filtered = filtered.filter((t) =>
        t.title?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.assigneeName?.toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q)
      );
    }

    // Tab filtering
    if (tab === 'Pending') {
      filtered = filtered.filter((t) => !t.completed && t.status !== 'Completed');
    } else if (tab === 'Completed') {
      filtered = filtered.filter((t) => t.completed || t.status === 'Completed');
    } else if (tab === 'Overdue') {
      filtered = filtered.filter((t) => t.priority === 'Urgent' || t.status === 'Escalated' || t.isEscalated);
    }

    // Compute summary stats
    const stats = {
      total: tasks.length,
      pending: tasks.filter((t) => !t.completed && t.status !== 'Completed').length,
      completed: tasks.filter((t) => t.completed || t.status === 'Completed').length,
      overdue: tasks.filter((t) => t.priority === 'Urgent' || t.status === 'Escalated' || t.isEscalated).length,
    };

    return res.json({
      success: true,
      count: filtered.length,
      stats,
      data: filtered,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get assignable staff members for delegation
// @route   GET /api/apps/tasks/staff
export const getStaffMembers = async (req: Request, res: Response) => {
  try {
    let staff = DEFAULT_STAFF_MEMBERS;
    if (mongoose.connection.readyState === 1) {
      try {
        const users = await User.find({ isActive: { $ne: false } }).select('firstName lastName email role designation');
        if (users && users.length > 0) {
          staff = users.map((u) => ({
            id: String(u._id),
            name: `${u.firstName} ${u.lastName}`,
            role: u.designation || 'Staff Member',
            department: 'Academic & Admin',
            email: u.email,
          }));
        }
      } catch (e) {}
    }
    return res.json({ success: true, staff });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create / Delegate Task
// @route   POST /api/apps/tasks
export const createTask = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      assigneeId,
      assigneeName,
      assigneeRole,
      department,
      dueDate,
      priority = 'Medium',
      category = 'Academic',
      slaHours = 48,
      erpTriggerSource,
    } = req.body;

    const userId = req.user?.id || new mongoose.Types.ObjectId();
    const assignedStatus = assigneeName ? 'Assigned' : 'Pending';

    const newTaskData: any = {
      title,
      description: description || 'Operational task action item',
      assignedTo: assigneeId && mongoose.isValidObjectId(assigneeId) ? assigneeId : undefined,
      assigneeId: assigneeId && mongoose.isValidObjectId(assigneeId) ? assigneeId : undefined,
      assigneeName: assigneeName || 'Unassigned',
      assigneeRole: assigneeRole || 'Staff',
      department: department || 'Operations',
      createdBy: userId,
      assignedByName: 'Super Admin',
      dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 1000 * 60 * 60 * slaHours),
      dateString: dueDate || new Date(Date.now() + 1000 * 60 * 60 * slaHours).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
      priority,
      status: assignedStatus,
      category,
      slaHours: Number(slaHours) || 48,
      isEscalated: priority === 'Urgent',
      erpTriggerSource: erpTriggerSource || undefined,
      completed: false,
      icon: category === 'Finance' ? '💳' : category === 'Transport' ? '🚌' : category === 'Administration' ? '👥' : '📄',
      createdAt: new Date(),
    };

    let createdTask = null;
    if (mongoose.connection.readyState === 1) {
      try {
        createdTask = await Task.create(newTaskData);
      } catch (dbErr) {
        createdTask = { ...newTaskData, _id: `task_${Date.now()}`, id: `task_${Date.now()}` };
        inMemoryTasks.unshift(createdTask);
      }
    } else {
      createdTask = { ...newTaskData, _id: `task_${Date.now()}`, id: `task_${Date.now()}` };
      inMemoryTasks.unshift(createdTask);
    }

    // Real-time broadcast via Socket.IO
    emitSocketSafe('task:assigned', {
      task: createdTask,
      message: `New task delegated: "${title}" assigned to ${assigneeName || 'Staff'}`,
    });

    // Save notification to DB if available
    if (mongoose.connection.readyState === 1 && assigneeId && mongoose.isValidObjectId(assigneeId)) {
      try {
        await Notification.create({
          userId: assigneeId,
          title: `Task Assigned: ${title}`,
          message: `Super Admin delegated an action item (${priority} priority). SLA: ${slaHours}h.`,
          type: 'support',
          priority: priority.toLowerCase(),
        });
      } catch (e) {}
    }

    return res.status(201).json({ success: true, data: createdTask });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update task status & lifecycle
// @route   PATCH /api/apps/tasks/:id/status
export const updateTaskStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const isCompleted = status === 'Completed';
    const updates: any = { status };
    if (isCompleted) {
      updates.completed = true;
      updates.completedAt = new Date();
    } else {
      updates.completed = false;
    }

    let updatedTask = null;
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      try {
        updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true });
      } catch (e) {}
    }

    if (!updatedTask) {
      const idx = inMemoryTasks.findIndex((t) => t._id === id || t.id === id);
      if (idx !== -1) {
        inMemoryTasks[idx] = { ...inMemoryTasks[idx], ...updates };
        updatedTask = inMemoryTasks[idx];
      }
    }

    if (!updatedTask) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    emitSocketSafe('task:updated', { task: updatedTask });
    return res.json({ success: true, data: updatedTask });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Escalate task to Super Admin / SLA breach
// @route   PATCH /api/apps/tasks/:id/escalate
export const escalateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const updates: any = {
      isEscalated: true,
      status: 'Escalated',
      priority: 'Urgent',
      escalationReason: reason || 'SLA Overdue: Escalated to Super Admin for immediate intervention.',
    };

    let updatedTask = null;
    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      try {
        updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true });
      } catch (e) {}
    }

    if (!updatedTask) {
      const idx = inMemoryTasks.findIndex((t) => t._id === id || t.id === id);
      if (idx !== -1) {
        inMemoryTasks[idx] = { ...inMemoryTasks[idx], ...updates };
        updatedTask = inMemoryTasks[idx];
      }
    }

    if (!updatedTask) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    emitSocketSafe('task:escalated', {
      task: updatedTask,
      reason: updates.escalationReason,
      message: `🚨 Critical Task Escalated: "${updatedTask.title}" has breached SLA!`,
    });

    return res.json({ success: true, data: updatedTask });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Trigger automated ERP workflow tasks
// @route   POST /api/apps/tasks/trigger-erp
export const triggerERPTasks = async (req: Request, res: Response) => {
  try {
    const newERPEventTask = {
      _id: `task_erp_${Date.now()}`,
      id: `task_erp_${Date.now()}`,
      title: 'Audit Disciplinary Incident Report #DISC-881 (Grade 9 Common Room)',
      description: 'Automated ERP Trigger: Incident recorded by Homeroom Proctor. Requires counseling review and parent notification confirmation.',
      category: 'Academic',
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
      dateString: new Date(Date.now() + 1000 * 60 * 60 * 24).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
      priority: 'High',
      status: 'Assigned',
      assigneeName: 'Elena Rostova',
      assigneeRole: 'Dean of Students & Discipline',
      department: 'Student Welfare',
      assignedByName: 'Super Admin',
      slaHours: 24,
      isEscalated: false,
      erpTriggerSource: 'ERP Discipline Module Trigger: Case #DISC-881',
      icon: '🛡️',
      completed: false,
      createdAt: new Date(),
    };

    inMemoryTasks.unshift(newERPEventTask);
    if (mongoose.connection.readyState === 1) {
      try {
        await Task.create(newERPEventTask);
      } catch (e) {}
    }

    emitSocketSafe('task:assigned', {
      task: newERPEventTask,
      message: `Automated ERP event triggered new administrative task: "${newERPEventTask.title}"`,
    });

    return res.status(201).json({
      success: true,
      message: 'Automated ERP task successfully triggered and delegated.',
      data: newERPEventTask,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete / Dismiss Task
// @route   DELETE /api/apps/tasks/:id
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.isValidObjectId(id)) {
      try {
        await Task.findByIdAndDelete(id);
      } catch (e) {}
    }

    inMemoryTasks = inMemoryTasks.filter((t) => t._id !== id && t.id !== id);
    return res.json({ success: true, message: 'Task removed successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// --- NOTES ---
export const getNotes = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const notes = await Note.find(userId ? { author: userId } : {}).sort({ isPinned: -1, createdAt: -1 });
    return res.json({ success: true, count: notes.length, data: notes });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createNote = async (req: Request, res: Response) => {
  try {
    const { title, content, isPinned, tags, color } = req.body;
    const userId = req.user?.id || new mongoose.Types.ObjectId();

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
    const files = await FileRecord.find(userId ? { $or: [{ uploadedBy: userId }, { isPublic: true }] } : { isPublic: true }).sort({ createdAt: -1 });
    return res.json({ success: true, count: files.length, data: files });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createFileRecord = async (req: Request, res: Response) => {
  try {
    const { name, originalName, mimeType, size, url, folder, isPublic } = req.body;
    const userId = req.user?.id || new mongoose.Types.ObjectId();

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
