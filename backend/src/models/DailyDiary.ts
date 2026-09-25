import mongoose, { Schema, Document } from 'mongoose';

export interface IDailyDiary extends Document {
  studentId?: mongoose.Types.ObjectId;
  classId?: mongoose.Types.ObjectId;
  sectionId?: mongoose.Types.ObjectId;
  className?: string;
  sectionName?: string;
  date: Date;
  todayLearning?: string;
  todayActivity?: string;
  homework?: string;
  teacherNote?: string;
  teacherName?: string;
  mood?: 'Happy' | 'Quiet' | 'Fussy' | 'Energetic' | 'Calm';
  meals?: {
    type: string;
    status: string;
  }[];
  napTime?: {
    duration: string;
  };
  activities: string[];
  notes: string;
  teacherId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DailyDiarySchema: Schema = new Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      index: true,
    },
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
    className: { type: String, trim: true },
    sectionName: { type: String, trim: true },
    date: { type: Date, required: true, default: Date.now, index: true },
    todayLearning: { type: String, trim: true },
    todayActivity: { type: String, trim: true },
    homework: { type: String, trim: true },
    teacherNote: { type: String, trim: true },
    teacherName: { type: String, trim: true },
    mood: {
      type: String,
      enum: ['Happy', 'Quiet', 'Fussy', 'Energetic', 'Calm'],
      default: 'Happy',
    },
    meals: [
      {
        type: { type: String },
        status: { type: String },
      },
    ],
    napTime: {
      duration: { type: String, default: '' },
    },
    activities: [{ type: String }],
    notes: { type: String, default: '' },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

DailyDiarySchema.index({ classId: 1, sectionId: 1, date: -1 });

export default mongoose.models.DailyDiary || mongoose.model<IDailyDiary>('DailyDiary', DailyDiarySchema);
