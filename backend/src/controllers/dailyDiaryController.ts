import { Request, Response } from 'express';
import DailyDiary from '../models/DailyDiary';
import Student from '../models/Student';
import { getIO } from '../socket';

// @desc    Get all daily diaries for a class/date
// @route   GET /api/daily-diary
export const getDailyDiaries = async (req: Request, res: Response) => {
  try {
    const { date, grade } = req.query;
    
    // First, get all students in the grade (or parent's children)
    let studentQuery: Record<string, unknown> = {};
    if (grade) studentQuery.grade = grade;
    if (req.user?.role === 'Parent') {
      studentQuery.parentId = req.user.id;
    }
    const students = await Student.find(studentQuery);
    const studentIds = students.map(s => s._id);

    let query: Record<string, unknown> = { studentId: { $in: studentIds } };
    
    if (date) {
      const queryDate = new Date(date as string);
      const nextDay = new Date(queryDate);
      nextDay.setDate(queryDate.getDate() + 1);
      
      query.date = {
        $gte: queryDate,
        $lt: nextDay
      };
    }

    const diaries = await DailyDiary.find(query)
      .populate('studentId', 'firstName lastName')
      .populate('teacherId', 'firstName lastName');
    res.json(diaries);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create or Update a daily diary
// @route   POST /api/daily-diary
export const saveDailyDiary = async (req: Request, res: Response) => {
  try {
    const { studentId, date, meals, napTime, mood, activities, notes } = req.body;
    const teacherId = req.user?.id;

    // Normalize date
    const recordDate = new Date(date);
    recordDate.setHours(0, 0, 0, 0);

    const diary = await DailyDiary.findOneAndUpdate(
      { studentId, date: recordDate },
      { 
        studentId, 
        date: recordDate, 
        teacherId,
        meals,
        napTime,
        mood,
        activities,
        notes
      },
      { new: true, upsert: true }
    );

    res.status(200).json(diary);
  } catch (error) {
    res.status(400).json({ message: 'Invalid diary data', error });
  }
};
