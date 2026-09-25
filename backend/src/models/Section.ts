import mongoose, { Schema, Document } from 'mongoose';

export interface ISection extends Document {
  name: string;
  classId: mongoose.Types.ObjectId;
  teacherId?: mongoose.Types.ObjectId;
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
}

const SectionSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: 'User' },
    capacity: { type: Number, required: true, default: 30 },
  },
  { timestamps: true }
);

SectionSchema.index({ name: 1, classId: 1 }, { unique: true });

export default mongoose.models.Section || mongoose.model<ISection>('Section', SectionSchema);
