import mongoose, { Schema, Document } from 'mongoose';

export type ActivityCategory =
  | 'Art & Craft'
  | 'Story Time'
  | 'Rhymes'
  | 'Drawing'
  | 'Writing'
  | 'Games'
  | 'Songs'
  | 'Worksheets'
  | 'Outdoor Activity'
  | 'Classroom Celebration';

export interface IClassroomActivity extends Document {
  classId: mongoose.Types.ObjectId;
  sectionId?: mongoose.Types.ObjectId;
  className?: string;
  sectionName?: string;
  title: string;
  category: ActivityCategory;
  description: string;
  icon?: string;
  photos: string[];
  teacherId?: mongoose.Types.ObjectId;
  teacherName: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ClassroomActivitySchema: Schema = new Schema(
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
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: [
        'Art & Craft',
        'Story Time',
        'Rhymes',
        'Drawing',
        'Writing',
        'Games',
        'Songs',
        'Worksheets',
        'Outdoor Activity',
        'Classroom Celebration',
      ],
      default: 'Art & Craft',
    },
    description: { type: String, required: true, trim: true },
    icon: { type: String, trim: true },
    photos: [{ type: String, trim: true }],
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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

ClassroomActivitySchema.index({ classId: 1, sectionId: 1, date: -1 });

export default mongoose.model<IClassroomActivity>('ClassroomActivity', ClassroomActivitySchema);
