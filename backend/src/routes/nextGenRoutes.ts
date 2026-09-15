import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth';
import {
  getLessonPlans,
  createLessonPlan,
  generateQuestionPaper,
  generateExamSeatingPlan,
  getWorkflows,
  createWorkflowRule,
} from '../controllers/nextGenController';

const router = Router();

// Lesson plans
router.get('/lesson-plans', protect, getLessonPlans);
router.post('/lesson-plans', protect, createLessonPlan);

// Exam generators
router.post('/paper-generator', protect, generateQuestionPaper);
router.post('/seating-plan', protect, generateExamSeatingPlan);

// Workflow rules
router.get('/workflows', protect, getWorkflows);
router.post('/workflows', protect, adminOnly, createWorkflowRule);

export default router;
