import dailyDiaryRoutes from '../../routes/dailyDiaryRoutes';
import assessmentRoutes from '../../routes/assessmentRoutes';
import examRoutes from '../../routes/examRoutes';
import learningRoutes from '../../routes/learningRoutes';

export * as dailyDiaryController from '../../controllers/dailyDiaryController';
export * as assessmentController from '../../controllers/assessmentController';
export * as examController from '../../controllers/examController';
export * as learningController from '../../controllers/learningController';

export { default as DailyDiary } from '../../models/DailyDiary';
export { default as Assessment } from '../../models/Assessment';
export { default as OnlineExam } from '../../models/OnlineExam';
export { default as LearningMaterial } from '../../models/LearningMaterial';

export { dailyDiaryRoutes, assessmentRoutes, examRoutes, learningRoutes };
