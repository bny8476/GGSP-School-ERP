import dailyDiaryRoutes from '../../routes/dailyDiaryRoutes';
import assessmentRoutes from '../../routes/assessmentRoutes';
import examRoutes from '../../routes/examRoutes';
import learningRoutes from '../../routes/learningRoutes';
import classWorkRoutes from '../../routes/classWorkRoutes';
import activityRoutes from '../../routes/activityRoutes';
import homeworkRoutes from '../../routes/homeworkRoutes';
import teacherRemarkRoutes from '../../routes/teacherRemarkRoutes';

export * as dailyDiaryController from '../../controllers/dailyDiaryController';
export * as assessmentController from '../../controllers/assessmentController';
export * as examController from '../../controllers/examController';
export * as learningController from '../../controllers/learningController';
export * as classWorkController from '../../controllers/classWorkController';
export * as activityController from '../../controllers/activityController';
export * as homeworkController from '../../controllers/homeworkController';
export * as teacherRemarkController from '../../controllers/teacherRemarkController';

export { default as DailyDiary } from '../../models/DailyDiary';
export { default as Assessment } from '../../models/Assessment';
export { default as OnlineExam } from '../../models/OnlineExam';
export { default as LearningMaterial } from '../../models/LearningMaterial';
export { default as ClassWork } from '../../models/ClassWork';
export { default as ClassroomActivity } from '../../models/ClassroomActivity';
export { default as Homework } from '../../models/Homework';
export { default as TeacherRemark } from '../../models/TeacherRemark';

export {
  dailyDiaryRoutes,
  assessmentRoutes,
  examRoutes,
  learningRoutes,
  classWorkRoutes,
  activityRoutes,
  homeworkRoutes,
  teacherRemarkRoutes,
};
