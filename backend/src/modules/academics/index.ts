import academicRoutes from '../../routes/academicRoutes';
import classRoutes from '../../routes/classRoutes';
import curriculumRoutes from '../../routes/curriculumRoutes';

export * as academicController from '../../controllers/academicController';
export * as classController from '../../controllers/classController';
export * as curriculumController from '../../controllers/curriculumController';

export { default as AcademicYear } from '../../models/AcademicYear';
export { default as Class } from '../../models/Class';
export { default as Section } from '../../models/Section';
export { default as Subject } from '../../models/Subject';
export { default as Curriculum } from '../../models/Curriculum';
export { default as TimeTable } from '../../models/TimeTable';

export { academicRoutes, classRoutes, curriculumRoutes };
