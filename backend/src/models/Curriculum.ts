import mongoose, { Schema, Document } from 'mongoose';

export interface ICurriculum extends Document {
  title: string;
  theme: string;
  grade: 'Pre-KG' | 'LKG' | 'UKG';
  weekStartDate: Date;
  weekEndDate: Date;
  activities: {
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
    description: string;
    learningOutcomes: string[];
  }[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CurriculumSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    theme: { type: String, required: true },
    grade: { type: String, enum: ['Pre-KG', 'LKG', 'UKG'], required: true },
    weekStartDate: { type: Date, required: true },
    weekEndDate: { type: Date, required: true },
    activities: [
      {
        day: {
          type: String,
          enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          required: true,
        },
        description: { type: String, required: true },
        learningOutcomes: [{ type: String }],
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Curriculum || mongoose.model<ICurriculum>('Curriculum', CurriculumSchema);
