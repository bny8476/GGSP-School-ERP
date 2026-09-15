import mongoose, { Schema, Document } from 'mongoose';

export interface ILearningMaterial extends Document {
  title: string;
  classId: mongoose.Types.ObjectId;
  subject: string;
  chapter?: string;
  topic?: string;
  fileUrl: string;
  fileType: 'PDF' | 'Video' | 'Document' | 'Link';
  description?: string;
  uploadedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LearningMaterialSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    subject: { type: String, required: true },
    chapter: { type: String },
    topic: { type: String },
    fileUrl: { type: String, required: true },
    fileType: { type: String, enum: ['PDF', 'Video', 'Document', 'Link'], default: 'PDF' },
    description: { type: String },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ILearningMaterial>('LearningMaterial', LearningMaterialSchema);
