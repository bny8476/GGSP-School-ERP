import mongoose, { Schema, Document } from 'mongoose';

export interface IHealthLog extends Document {
  studentId: mongoose.Types.ObjectId;
  date: Date;
  temperature: number;
  symptoms: string[];
  medicationAdministered?: string;
  allergiesAlert: boolean;
  notes: string;
  loggedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const HealthLogSchema: Schema = new Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    date: { type: Date, required: true, default: Date.now },
    temperature: { type: Number, required: true },
    symptoms: [{ type: String }],
    medicationAdministered: { type: String },
    allergiesAlert: { type: Boolean, default: false },
    notes: { type: String },
    loggedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.HealthLog || mongoose.model<IHealthLog>('HealthLog', HealthLogSchema);
