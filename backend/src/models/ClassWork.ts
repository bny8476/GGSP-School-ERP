import mongoose, { Schema, Document } from 'mongoose';

export interface IClassWork extends Document {
  classId: mongoose.Types.ObjectId;
  sectionId?: mongoose.Types.ObjectId;
  className?: string;
  sectionName?: string;
  subject: string;
  topic: string;
  whatWasTaught: string; // What We Learned
  learningObjective?: string;
  classroomActivity?: string;
  worksheetUrl?: string;
  homework?: string;
  teacherRemark?: string;
  photos: string[];
  attachments: {
    name: string;
    url: string;
  }[];
  teacherId: mongoose.Types.ObjectId;
  teacherName: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ClassWorkSchema: Schema = new Schema(
  {
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
    subject: { type: String, required: true, trim: true },
    topic: { type: String, required: true, trim: true },
    whatWasTaught: { type: String, required: true, trim: true },
    learningObjective: { type: String, trim: true },
    classroomActivity: { type: String, trim: true },
    worksheetUrl: { type: String, trim: true },
    homework: { type: String, trim: true },
    teacherRemark: { type: String, trim: true },
    photos: [{ type: String, trim: true }],
    attachments: [
      {
        name: { type: String, trim: true },
        url: { type: String, trim: true },
      },
    ],
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
    date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

ClassWorkSchema.index({ classId: 1, sectionId: 1, date: -1 });

export default mongoose.model<IClassWork>('ClassWork', ClassWorkSchema);
