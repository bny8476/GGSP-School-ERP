import mongoose, { Schema, Document } from 'mongoose';

export interface IPeriod {
  startTime: string; // e.g., "09:00"
  endTime: string;   // e.g., "09:45"
  subjectId: mongoose.Types.ObjectId;
  teacherId?: mongoose.Types.ObjectId; // Optional, might use class teacher by default
  room?: string;
}

export interface ITimeTable extends Document {
  classId: mongoose.Types.ObjectId;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  periods: IPeriod[];
  createdAt: Date;
  updatedAt: Date;
}

const PeriodSchema: Schema = new Schema({
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  room: { type: String },
});

const TimeTableSchema: Schema = new Schema(
  {
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    dayOfWeek: { 
      type: String, 
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], 
      required: true 
    },
    periods: [PeriodSchema],
  },
  { timestamps: true }
);

// Ensure one timetable per class per day
TimeTableSchema.index({ classId: 1, dayOfWeek: 1 }, { unique: true });

export default mongoose.models.TimeTable || mongoose.model<ITimeTable>('TimeTable', TimeTableSchema);
