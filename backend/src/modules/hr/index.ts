import userRoutes from '../../routes/userRoutes';
import payrollRoutes from '../../routes/payrollRoutes';
import leaveRoutes from '../../routes/leaveRoutes';
import recruitmentRoutes from '../../routes/recruitmentRoutes';

export * as userController from '../../controllers/userController';
export * as payrollController from '../../controllers/payrollController';
export * as leaveController from '../../controllers/leaveController';
export * as recruitmentController from '../../controllers/recruitmentController';

export { default as User } from '../../models/User';
export { default as Role } from '../../models/Role';
export { default as Employee } from '../../models/Employee';
export { default as TeacherProfile } from '../../models/TeacherProfile';
export { default as Payroll } from '../../models/Payroll';
export { default as LeaveRequest } from '../../models/LeaveRequest';

export { userRoutes, payrollRoutes, leaveRoutes, recruitmentRoutes };
