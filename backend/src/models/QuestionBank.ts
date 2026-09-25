import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestionBank extends Document {
  questionText: string;
  options: string[];
  correctAnswer: string;
  subject: string;
  classId?: mongoose.Types.ObjectId;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  marks: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionBankSchema: Schema = new Schema(
  {
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
    subject: { type: String, required: true },
    classId: { type: Schema.Types.ObjectId, ref: 'Class' },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    marks: { type: Number, required: true, default: 1 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.models.QuestionBank || mongoose.model<IQuestionBank>('QuestionBank', QuestionBankSchema);
