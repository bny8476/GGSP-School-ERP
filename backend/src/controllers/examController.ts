import { Request, Response, NextFunction } from 'express';
import QuestionBank from '../models/QuestionBank';
import OnlineExam from '../models/OnlineExam';
import { ApiError } from '../utils/ApiError';

// --- QUESTION BANK ---
export const getQuestions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { subject, difficulty, classId } = req.query;
    const filter: any = {};
    if (subject) filter.subject = String(subject);
    if (difficulty) filter.difficulty = String(difficulty);
    if (classId) filter.classId = String(classId);

    const questions = await QuestionBank.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: questions.length, data: questions });
  } catch (error) {
    next(error);
  }
};

export const createQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user?._id;
    const question = await QuestionBank.create({ ...req.body, createdBy: userId });
    res.status(201).json({ success: true, data: question });
  } catch (error) {
    next(error);
  }
};

// --- ONLINE EXAMS ---
export const getExams = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { classId, status } = req.query;
    const filter: any = {};
    if (classId) filter.classId = String(classId);
    if (status) filter.status = String(status);

    const exams = await OnlineExam.find(filter)
      .populate('questions')
      .populate('classId', 'name grade')
      .sort({ startDate: 1 });
    res.json({ success: true, count: exams.length, data: exams });
  } catch (error) {
    next(error);
  }
};

export const createExam = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user?._id;
    const exam = await OnlineExam.create({ ...req.body, createdBy: userId });
    res.status(201).json({ success: true, data: exam });
  } catch (error) {
    next(error);
  }
};

export const submitExamAttempt = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { studentId, answers } = req.body; // answers: [{ questionId, selectedOption }]

    const exam = await OnlineExam.findById(id).populate('questions');
    if (!exam) throw new ApiError(404, 'Exam not found');

    let totalScore = 0;
    const gradedAnswers = answers.map((ans: any) => {
      const q = (exam.questions as any[]).find((item) => String(item._id) === String(ans.questionId));
      const isCorrect = q ? q.correctAnswer === ans.selectedOption : false;
      if (isCorrect) totalScore += q?.marks || 1;
      return {
        questionId: ans.questionId,
        selectedOption: ans.selectedOption,
        isCorrect,
      };
    });

    exam.attempts.push({
      studentId,
      score: totalScore,
      totalScore: exam.totalMarks,
      answers: gradedAnswers,
      submittedAt: new Date(),
    });

    await exam.save();
    res.json({
      success: true,
      message: 'Exam submitted successfully',
      score: totalScore,
      totalMarks: exam.totalMarks,
      passed: totalScore >= exam.passingMarks,
    });
  } catch (error) {
    next(error);
  }
};
