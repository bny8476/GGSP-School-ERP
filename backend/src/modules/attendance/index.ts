import attendanceRoutes from '../../routes/attendanceRoutes';
export * as attendanceController from '../../controllers/attendanceController';

export { default as Attendance } from '../../models/Attendance';
export { default as StudentAttendance } from '../../models/StudentAttendance';
export { default as EmployeeAttendance } from '../../models/EmployeeAttendance';

export { attendanceRoutes };
export default attendanceRoutes;
