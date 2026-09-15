import { Router } from 'express';
import { authenticate, authorizeRoles } from '../middleware/auth';

import { getQuestions, createQuestion, getExams, createExam, submitExamAttempt } from '../controllers/examController';

const router = Router();

router.use(authenticate);

// Questions
router.get('/questions', getQuestions);
router.post('/questions', authorizeRoles('Super Admin', 'Admin', 'Teacher'), createQuestion);

// Exams
router.get('/', getExams);
router.post('/', authorizeRoles('Super Admin', 'Admin', 'Teacher'), createExam);
router.post('/:id/submit', submitExamAttempt);

export default router;
