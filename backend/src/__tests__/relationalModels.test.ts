import mongoose from 'mongoose';
import Enrollment from '../models/Enrollment';
import StudentParent from '../models/StudentParent';
import StudentAttendance from '../models/StudentAttendance';
import EmployeeAttendance from '../models/EmployeeAttendance';
import Employee from '../models/Employee';
import TeacherProfile from '../models/TeacherProfile';

describe('Phase 2 Relational Models & Domain Segregation', () => {
  const dummyStudentId = new mongoose.Types.ObjectId();
  const dummyParentId1 = new mongoose.Types.ObjectId();
  const dummyParentId2 = new mongoose.Types.ObjectId();
  const dummyYearId = new mongoose.Types.ObjectId();
  const dummyClassId = new mongoose.Types.ObjectId();
  const dummySectionId = new mongoose.Types.ObjectId();
  const dummyUserId = new mongoose.Types.ObjectId();
  const dummyEmployeeId = new mongoose.Types.ObjectId();

  describe('Enrollment Model', () => {
    it('should validate an enrollment record linking student and academic year', () => {
      const enrollment = new Enrollment({
        studentId: dummyStudentId,
        academicYearId: dummyYearId,
        classId: dummyClassId,
        sectionId: dummySectionId,
        rollNumber: 'LKG-01',
        status: 'Active',
      });

      const err = enrollment.validateSync();
      expect(err).toBeUndefined();
      expect(enrollment.status).toBe('Active');
      expect(enrollment.rollNumber).toBe('LKG-01');
    });

    it('should require studentId, academicYearId, and classId', () => {
      const enrollment = new Enrollment({});
      const err = enrollment.validateSync();
      expect(err?.errors['studentId']).toBeDefined();
      expect(err?.errors['academicYearId']).toBeDefined();
      expect(err?.errors['classId']).toBeDefined();
    });
  });

  describe('StudentParent Junction Model', () => {
    it('should create a valid junction linking a parent to a child with pickup permissions', () => {
      const relation = new StudentParent({
        studentId: dummyStudentId,
        parentId: dummyParentId1,
        relationship: 'Mother',
        isPrimary: true,
        canPickup: true,
        receivesNotifications: true,
        emergencyContact: true,
      });

      const err = relation.validateSync();
      expect(err).toBeUndefined();
      expect(relation.relationship).toBe('Mother');
      expect(relation.canPickup).toBe(true);
    });

    it('should support multiple parents for the same child', () => {
      const fatherRelation = new StudentParent({
        studentId: dummyStudentId,
        parentId: dummyParentId1,
        relationship: 'Father',
        isPrimary: true,
      });
      const motherRelation = new StudentParent({
        studentId: dummyStudentId,
        parentId: dummyParentId2,
        relationship: 'Mother',
        isPrimary: false,
      });

      expect(fatherRelation.validateSync()).toBeUndefined();
      expect(motherRelation.validateSync()).toBeUndefined();
      expect(fatherRelation.studentId).toEqual(motherRelation.studentId);
      expect(fatherRelation.parentId).not.toEqual(motherRelation.parentId);
    });
  });

  describe('StudentAttendance vs EmployeeAttendance', () => {
    it('should create student classroom roll-call with class and section links', () => {
      const studentAtt = new StudentAttendance({
        studentId: dummyStudentId,
        academicYearId: dummyYearId,
        classId: dummyClassId,
        sectionId: dummySectionId,
        date: new Date('2026-09-18'),
        status: 'Present',
        markedBy: dummyUserId,
        remarks: 'On time',
      });

      const err = studentAtt.validateSync();
      expect(err).toBeUndefined();
      expect(studentAtt.status).toBe('Present');
      expect(studentAtt.classId).toEqual(dummyClassId);
    });

    it('should create employee attendance with check-in and check-out times', () => {
      const now = new Date();
      const empAtt = new EmployeeAttendance({
        employeeId: dummyEmployeeId,
        userId: dummyUserId,
        date: now,
        status: 'Present',
        checkIn: new Date(now.getTime() - 8 * 3600 * 1000),
        checkOut: now,
        markedBy: dummyUserId,
      });

      const err = empAtt.validateSync();
      expect(err).toBeUndefined();
      expect(empAtt.checkIn).toBeDefined();
      expect(empAtt.checkOut).toBeDefined();
    });
  });

  describe('Employee and TeacherProfile Models', () => {
    it('should create employee record separated from user authentication', () => {
      const employee = new Employee({
        userId: dummyUserId,
        employeeCode: 'EMP-101',
        firstName: 'Sarah',
        lastName: 'Jenkins',
        designation: 'Head of Mathematics',
        department: 'Academics',
        salary: 5000,
        qualification: 'M.Sc. Mathematics, B.Ed.',
        experienceYears: 8,
      });

      const err = employee.validateSync();
      expect(err).toBeUndefined();
      expect(employee.employeeCode).toBe('EMP-101');
      expect(employee.salary).toBe(5000);
    });

    it('should create teacher profile with assignments and specializations', () => {
      const teacher = new TeacherProfile({
        userId: dummyUserId,
        employeeId: dummyEmployeeId,
        specializations: ['Early Childhood Education', 'Phonics'],
        teachingAssignments: [
          {
            classId: dummyClassId,
            sectionId: dummySectionId,
            subjectId: new mongoose.Types.ObjectId(),
          },
        ],
      });

      const err = teacher.validateSync();
      expect(err).toBeUndefined();
      expect(teacher.specializations).toContain('Phonics');
      expect(teacher.teachingAssignments.length).toBe(1);
    });
  });
});
