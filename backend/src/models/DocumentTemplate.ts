import mongoose, { Schema, Document } from 'mongoose';

export interface IDocumentTemplate extends Document {
  title: string;
  category: 'PDF' | 'Certificate' | 'Receipt' | 'Invoice' | 'Letter' | 'Report';
  campusId?: mongoose.Types.ObjectId;
  templateBody: string; // e.g. "Dear {{student.name}}, Welcome to {{school.name}}"
  version: number;
  isPublished: boolean;
  variables: string[];
  createdAt: Date;
  updatedAt: Date;
}

const DocumentTemplateSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['PDF', 'Certificate', 'Receipt', 'Invoice', 'Letter', 'Report']
    },
    campusId: { type: Schema.Types.ObjectId, ref: 'Campus' },
    templateBody: { type: String, required: true },
    version: { type: Number, default: 1 },
    isPublished: { type: Boolean, default: true },
    variables: [{ type: String }]
  },
  { timestamps: true }
);

export default mongoose.models.DocumentTemplate || mongoose.model<IDocumentTemplate>('DocumentTemplate', DocumentTemplateSchema);
