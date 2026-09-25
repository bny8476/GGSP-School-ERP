import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployeeAttendance extends Document {
  employeeId?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  date: Date;
  status: 'Present' | 'Absent' | 'Late' | 'Half-Day' | 'On-Leave';
  checkIn?: Date;
  checkOut?: Date;
  markedBy?: mongoose.Types.ObjectId;
  approvedBy?: mongoose.Types.ObjectId;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeAttendanceSchema: Schema = new Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Present', 'Absent', 'Late', 'Half-Day', 'On-Leave'],
      default: 'Present',
    },
    checkIn: {
      type: Date,
    },
    checkOut: {
      type: Date,
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    remarks: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// One attendance record per user/employee per date
EmployeeAttendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.models.EmployeeAttendance || mongoose.model<IEmployeeAttendance>('EmployeeAttendance', EmployeeAttendanceSchema);
