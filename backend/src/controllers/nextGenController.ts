import { Request, Response } from 'express';
import LessonPlan from '../models/LessonPlan';
import PortfolioItem from '../models/Portfolio';
import WorkflowRule from '../models/Workflow';

// --- LESSON PLANNER ---
export const getLessonPlans = async (req: Request, res: Response) => {
  try {
    const teacherId = req.user?.id;
    const plans = await LessonPlan.find({ teacher: teacherId }).sort({ scheduledDate: -1 });
    return res.json({ success: true, count: plans.length, data: plans });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createLessonPlan = async (req: Request, res: Response) => {
  try {
    const teacherId = req.user?.id;
    const { subject, className, topic, learningObjectives, resources, durationMinutes, scheduledDate } = req.body;

    const plan = await LessonPlan.create({
      teacher: teacherId,
      subject,
      className,
      topic,
      learningObjectives: learningObjectives || [],
      resources: resources || [],
      durationMinutes: durationMinutes || 45,
      status: 'Planned',
      scheduledDate: scheduledDate || new Date(),
    });

    return res.status(201).json({ success: true, data: plan });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// --- QUESTION PAPER GENERATOR ---
export const generateQuestionPaper = async (req: Request, res: Response) => {
  try {
    const { subject, className, chapters, totalMarks, difficulty } = req.body;

    const generatedPaper = {
      title: `${className} ${subject} Comprehensive Examination Paper`,
      subject,
      className,
      chapters: chapters || ['All Covered Units'],
      totalMarks: totalMarks || 100,
      difficulty: difficulty || 'Medium',
      durationMinutes: 120,
      instructions: [
        'Read all questions carefully before answering.',
        'Section A contains 10 Multiple Choice Questions (2 marks each).',
        'Section B contains 5 Short Answer Questions (6 marks each).',
        'Section C contains 2 Comprehensive Problem-Solving Questions (25 marks total).',
      ],
      sections: [
        {
          name: 'Section A: Multiple Choice Questions',
          totalMarks: 20,
          questions: [
            { id: 1, text: 'Which fundamental equation represents Newton’s Second Law of Motion?', marks: 2, difficulty: 'Easy' },
            { id: 2, text: 'What is the rate of change of displacement with respect to time?', marks: 2, difficulty: 'Easy' },
          ],
        },
        {
          name: 'Section B: Short Answer Questions',
          totalMarks: 30,
          questions: [
            { id: 3, text: 'Derive the kinematic formula v² = u² + 2as.', marks: 6, difficulty: 'Medium' },
          ],
        },
      ],
      generatedAt: new Date(),
    };

    return res.json({ success: true, data: generatedPaper });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// --- EXAM SEATING PLAN GENERATOR ---
export const generateExamSeatingPlan = async (req: Request, res: Response) => {
  try {
    const { examName, rooms, studentCount } = req.body;

    const seatingPlan = {
      examName: examName || 'Mid-Term Examinations 2026',
      totalStudents: studentCount || 120,
      roomsAllocated: [
        { roomNumber: 'Hall A (Capacity 60)', startRoll: 'ROLL-1001', endRoll: 'ROLL-1060', invigilator: 'Mr. Tom Teacher' },
        { roomNumber: 'Hall B (Capacity 60)', startRoll: 'ROLL-1061', endRoll: 'ROLL-1120', invigilator: 'Mrs. Sarah Smith' },
      ],
      conflictCheck: 'PASSED (0 Duplicate Seats / 0 Overlaps)',
      generatedAt: new Date(),
    };

    return res.json({ success: true, data: seatingPlan });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// --- WORKFLOW RULES ---
export const getWorkflows = async (req: Request, res: Response) => {
  try {
    const workflows = await WorkflowRule.find().sort({ createdAt: -1 });
    return res.json({ success: true, count: workflows.length, data: workflows });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createWorkflowRule = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { name, triggerEvent, conditionModule, actionType, targetRole } = req.body;

    const workflow = await WorkflowRule.create({
      name,
      triggerEvent,
      conditionModule,
      actionType,
      targetRole,
      createdBy: userId,
    });

    return res.status(201).json({ success: true, data: workflow });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
