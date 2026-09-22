import mongoose, { Schema, Document } from 'mongoose';

export interface IHomeworkSubmission {
  studentId: mongoose.Types.ObjectId;
  status: 'Pending' | 'Submitted' | 'Completed' | 'Overdue';
  submittedAt?: Date;
  completedAt?: Date;
  remarks?: string;
}

export interface IHomework extends Document {
  subject: string;
  title: string;
  description: string;
  instructions?: string;
  dueDate: Date;
  attachmentUrl?: string;
  classId: mongoose.Types.ObjectId;
  sectionId?: mongoose.Types.ObjectId;
  className?: string;
  sectionName?: string;
  teacherId: mongoose.Types.ObjectId;
  teacherName: string;
  assignedDate: Date;
  submissions: IHomeworkSubmission[];
  createdAt: Date;
  updatedAt: Date;
}

const HomeworkSubmissionSchema = new Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Submitted', 'Completed', 'Overdue'],
      default: 'Pending',
    },
    submittedAt: { type: Date },
    completedAt: { type: Date },
    remarks: { type: String, trim: true },
  },
  { _id: false }
);

const HomeworkSchema: Schema = new Schema(
  {
    subject: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    instructions: { type: String, trim: true },
    dueDate: { type: Date, required: true, index: true },
    attachmentUrl: { type: String, trim: true },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
      index: true,
    },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
      index: true,
    },
    className: { type: String, trim: true },
    sectionName: { type: String, trim: true },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    teacherName: {
      type: String,
      required: true,
      trim: true,
    },
    assignedDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    submissions: [HomeworkSubmissionSchema],
  },
  { timestamps: true }
);

HomeworkSchema.index({ classId: 1, sectionId: 1, dueDate: 1 });

export default mongoose.model<IHomework>('Homework', HomeworkSchema);
