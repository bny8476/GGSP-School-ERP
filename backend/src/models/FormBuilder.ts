import mongoose, { Schema, Document } from 'mongoose';

export interface IFormBuilder extends Document {
  title: string;
  category: 'Admission' | 'Feedback' | 'Survey' | 'Application' | 'InternalRequest' | 'Custom';
  campusId?: mongoose.Types.ObjectId;
  fields: {
    id: string;
    label: string;
    type: string;
    placeholder?: string;
    required?: boolean;
    options?: string[];
  }[];
  isPublished: boolean;
  submissionsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const FormBuilderSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['Admission', 'Feedback', 'Survey', 'Application', 'InternalRequest', 'Custom']
    },
    campusId: { type: Schema.Types.ObjectId, ref: 'Campus' },
    fields: [
      {
        id: { type: String, required: true },
        label: { type: String, required: true },
        type: { type: String, required: true },
        placeholder: { type: String },
        required: { type: Boolean, default: false },
        options: [{ type: String }]
      }
    ],
    isPublished: { type: Boolean, default: true },
    submissionsCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model<IFormBuilder>('FormBuilder', FormBuilderSchema);
