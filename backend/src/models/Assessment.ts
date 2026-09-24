import mongoose, { Schema, Document } from 'mongoose';

export interface IRubricItem {
  category?: string;
  skill: string;
  score?: 'Mastered' | 'Developing' | 'Beginning' | string;
  rating?: string;
}

export interface IAssessment extends Document {
  childId: mongoose.Types.ObjectId;
  studentId?: mongoose.Types.ObjectId;
  title?: string;
  category?: string;
  term?: 'Term 1' | 'Term 2' | 'Term 3' | string;
  overallGrade?: string;
  rubrics: IRubricItem[];
  teacherComments?: string;
  teacherNotes?: string;
  date: Date;
  createdBy: mongoose.Types.ObjectId;
  schoolId?: mongoose.Types.ObjectId;
  campusId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const RubricItemSchema = new Schema(
  {
    category: { type: String },
    skill: { type: String, required: true },
    score: { type: String },
    rating: { type: String },
  },
  { _id: false }
);

const AssessmentSchema: Schema = new Schema(
  {
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Student', // Corrected from User to Student
      index: true,
    },
    title: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    term: {
      type: String,
      default: 'Term 1',
    },
    overallGrade: {
      type: String,
      trim: true,
    },
    rubrics: [RubricItemSchema],
    teacherComments: {
      type: String,
    },
    teacherNotes: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
    },
    campusId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
    },
  },
  { timestamps: true }
);

AssessmentSchema.index({ childId: 1, date: -1 });

export default mongoose.models.Assessment || mongoose.model<IAssessment>('Assessment', AssessmentSchema);
