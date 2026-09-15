import { Router } from 'express';
import { protect } from '../middleware/auth';
import { processAIQuery, getAIInsights, getEarlyWarningScores } from '../controllers/aiController';

const router = Router();

router.post('/assistant', protect, processAIQuery);
router.get('/insights', protect, getAIInsights);
router.get('/early-warning', protect, getEarlyWarningScores);

export default router;
