import mongoose, { Schema, Document } from 'mongoose';

export interface IMasterData extends Document {
  category: 'Country' | 'State' | 'City' | 'Religion' | 'Category' | 'BloodGroup' | 'Language' | 'Department' | 'Designation' | 'Subject' | 'FeeType' | 'ExpenseCategory' | 'DocumentType';
  name: string;
  code?: string;
  campusId?: mongoose.Types.ObjectId;
  metadata?: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MasterDataSchema: Schema = new Schema(
  {
    category: {
      type: String,
      required: true,
      enum: [
        'Country', 'State', 'City', 'Religion', 'Category', 'BloodGroup',
        'Language', 'Department', 'Designation', 'Subject', 'FeeType',
        'ExpenseCategory', 'DocumentType'
      ]
    },
    name: { type: String, required: true, trim: true },
    code: { type: String, trim: true },
    campusId: { type: Schema.Types.ObjectId, ref: 'Campus' },
    metadata: { type: Schema.Types.Mixed, default: {} },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

MasterDataSchema.index({ category: 1, campusId: 1, name: 1 });

export default mongoose.model<IMasterData>('MasterData', MasterDataSchema);
