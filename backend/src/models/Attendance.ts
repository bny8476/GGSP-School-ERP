import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
  date: Date;
  entityType: 'Student' | 'User';
  entityId: mongoose.Types.ObjectId;
  status: 'Present' | 'Absent' | 'Late' | 'Half-Day';
  markedBy: mongoose.Types.ObjectId;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema: Schema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    entityType: {
      type: String,
      required: true,
      enum: ['Student', 'User'],
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'entityType', // Dynamic reference based on entityType
    },
    status: {
      type: String,
      required: true,
      enum: ['Present', 'Absent', 'Late', 'Half-Day'],
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

// Compound index to ensure one attendance record per entity per day
AttendanceSchema.index({ date: 1, entityId: 1, entityType: 1 }, { unique: true });

export default mongoose.models.Attendance || mongoose.model<IAttendance>('Attendance', AttendanceSchema);
