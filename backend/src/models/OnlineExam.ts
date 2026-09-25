import mongoose, { Schema, Document } from 'mongoose';

export interface IExamAttempt {
  studentId: mongoose.Types.ObjectId;
  score: number;
  totalScore: number;
  answers: { questionId: string; selectedOption: string; isCorrect: boolean }[];
  submittedAt: Date;
}

export interface IOnlineExam extends Document {
  title: string;
  subject: string;
  classId: mongoose.Types.ObjectId;
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  questions: mongoose.Types.ObjectId[];
  startDate: Date;
  endDate: Date;
  status: 'Draft' | 'Published' | 'Completed';
  attempts: IExamAttempt[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const OnlineExamSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    durationMinutes: { type: Number, required: true, default: 45 },
    totalMarks: { type: Number, required: true, default: 50 },
    passingMarks: { type: Number, required: true, default: 20 },
    questions: [{ type: Schema.Types.ObjectId, ref: 'QuestionBank' }],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['Draft', 'Published', 'Completed'], default: 'Draft' },
    attempts: [
      {
        studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
        score: { type: Number, required: true },
        totalScore: { type: Number, required: true },
        answers: [
          {
            questionId: { type: String, required: true },
            selectedOption: { type: String, required: true },
            isCorrect: { type: Boolean, required: true },
          },
        ],
        submittedAt: { type: Date, default: Date.now },
      },
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.models.OnlineExam || mongoose.model<IOnlineExam>('OnlineExam', OnlineExamSchema);
