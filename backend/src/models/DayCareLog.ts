import mongoose, { Schema, Document } from 'mongoose';

export interface IDayCareLog extends Document {
  studentId: mongoose.Types.ObjectId;
  date: Date;
  checkInTime?: string;
  checkOutTime?: string;
  foodTracking?: string;
  sleepTracking?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DayCareLogSchema: Schema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    date: { type: Date, required: true },
    checkInTime: { type: String },
    checkOutTime: { type: String },
    foodTracking: { type: String },
    sleepTracking: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.DayCareLog || mongoose.model<IDayCareLog>('DayCareLog', DayCareLogSchema);
