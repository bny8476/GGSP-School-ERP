import mongoose, { Schema, Document } from 'mongoose';

export interface IFileRecord extends Document {
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  folder?: string;
  uploadedBy: mongoose.Types.ObjectId;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FileRecordSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true },
    folder: { type: String, default: 'General' },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.FileRecord || mongoose.model<IFileRecord>('FileRecord', FileRecordSchema);
