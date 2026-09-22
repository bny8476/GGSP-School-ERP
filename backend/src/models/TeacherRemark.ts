import mongoose, { Schema, Document } from 'mongoose';

export interface ITeacherRemark extends Document {
  studentId: mongoose.Types.ObjectId;
  studentName?: string;
  classId?: mongoose.Types.ObjectId;
  sectionId?: mongoose.Types.ObjectId;
  teacherId: mongoose.Types.ObjectId;
  teacherName: string;
  content: string;
  category: 'Academic' | 'Behavioral' | 'Appreciation' | 'Activity' | 'General';
  date: Date;
  parentReply?: string;
  parentRepliedAt?: Date;
  parentName?: string;
  readByParent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TeacherRemarkSchema: Schema = new Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true,
    },
    studentName: { type: String, trim: true },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      index: true,
    },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
      index: true,
    },
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
    content: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Academic', 'Behavioral', 'Appreciation', 'Activity', 'General'],
      default: 'General',
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    parentReply: {
      type: String,
      trim: true,
    },
    parentRepliedAt: {
      type: Date,
    },
    parentName: {
      type: String,
      trim: true,
    },
    readByParent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

TeacherRemarkSchema.index({ studentId: 1, date: -1 });

export default mongoose.model<ITeacherRemark>('TeacherRemark', TeacherRemarkSchema);
