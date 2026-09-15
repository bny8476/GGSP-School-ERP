import mongoose, { Schema, Document } from 'mongoose';

export interface ILessonPlan extends Document {
  teacher: mongoose.Types.ObjectId;
  subject: string;
  className: string;
  topic: string;
  learningObjectives: string[];
  resources: string[];
  durationMinutes: number;
  status: 'Planned' | 'Started' | 'Completed' | 'Needs Review';
  scheduledDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LessonPlanSchema: Schema = new Schema(
  {
    teacher: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    className: { type: String, required: true },
    topic: { type: String, required: true },
    learningObjectives: [{ type: String }],
    resources: [{ type: String }],
    durationMinutes: { type: Number, default: 45 },
    status: { type: String, enum: ['Planned', 'Started', 'Completed', 'Needs Review'], default: 'Planned' },
    scheduledDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.LessonPlan || mongoose.model<ILessonPlan>('LessonPlan', LessonPlanSchema);
