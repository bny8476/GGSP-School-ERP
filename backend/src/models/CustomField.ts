import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomField extends Document {
  entityType: 'Student' | 'Parent' | 'Teacher' | 'Staff' | 'Class' | 'Admission' | 'Fee' | 'Document';
  fieldName: string;
  label: string;
  fieldType: 'Text' | 'Number' | 'Date' | 'Dropdown' | 'MultiSelect' | 'Checkbox' | 'Radio' | 'File' | 'URL';
  options?: string[];
  isRequired: boolean;
  validationRegex?: string;
  visibilityRoles?: string[];
  campusId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CustomFieldSchema: Schema = new Schema(
  {
    entityType: {
      type: String,
      required: true,
      enum: ['Student', 'Parent', 'Teacher', 'Staff', 'Class', 'Admission', 'Fee', 'Document']
    },
    fieldName: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    fieldType: {
      type: String,
      required: true,
      enum: ['Text', 'Number', 'Date', 'Dropdown', 'MultiSelect', 'Checkbox', 'Radio', 'File', 'URL']
    },
    options: [{ type: String }],
    isRequired: { type: Boolean, default: false },
    validationRegex: { type: String },
    visibilityRoles: [{ type: String }],
    campusId: { type: Schema.Types.ObjectId, ref: 'Campus' }
  },
  { timestamps: true }
);

export default mongoose.models.CustomField || mongoose.model<ICustomField>('CustomField', CustomFieldSchema);
