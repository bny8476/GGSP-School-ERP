import studentRoutes from '../../routes/studentRoutes';
export * as studentController from '../../controllers/studentController';
export { default as Student } from '../../models/Student';
export { default as Enrollment } from '../../models/Enrollment';
export { default as StudentParent } from '../../models/StudentParent';

export { studentRoutes };
export default studentRoutes;
