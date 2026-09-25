import mongoose, { Schema, Document } from 'mongoose';

export interface IStudentAttendance extends Document {
  studentId: mongoose.Types.ObjectId;
  studentName?: string;
  enrollmentId?: mongoose.Types.ObjectId;
  academicYearId?: mongoose.Types.ObjectId;
  academicYear?: string;
  classId: mongoose.Types.ObjectId;
  className?: string;
  sectionId?: mongoose.Types.ObjectId;
  sectionName?: string;
  date: Date;
  status: 'Present' | 'Absent' | 'Late' | 'Excused' | 'Half-Day';
  checkInTime?: string;
  absenceReason?: string;
  teacherRemark?: string;
  teacherId?: mongoose.Types.ObjectId;
  teacherName?: string;
  markedBy: mongoose.Types.ObjectId;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const StudentAttendanceSchema: Schema = new Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true,
    },
    studentName: {
      type: String,
      trim: true,
    },
    enrollmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Enrollment',
      index: true,
    },
    academicYearId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicYear',
      index: true,
    },
    academicYear: {
      type: String,
      trim: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
      index: true,
    },
    className: {
      type: String,
      trim: true,
    },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
      index: true,
    },
    sectionName: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Present', 'Absent', 'Late', 'Excused', 'Half-Day'],
      default: 'Present',
    },
    checkInTime: {
      type: String,
      trim: true,
    },
    absenceReason: {
      type: String,
      trim: true,
    },
    teacherRemark: {
      type: String,
      trim: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    teacherName: {
      type: String,
      trim: true,
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    remarks: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Ensure one record per student per date
StudentAttendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });
StudentAttendanceSchema.index({ classId: 1, sectionId: 1, date: 1 });

export default mongoose.models.StudentAttendance || mongoose.model<IStudentAttendance>('StudentAttendance', StudentAttendanceSchema);
