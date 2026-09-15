import mongoose, { Schema, Document } from 'mongoose';

export interface IPortfolioItem extends Document {
  student: mongoose.Types.ObjectId;
  title: string;
  category: 'Project' | 'Certificate' | 'Award' | 'Artwork' | 'Presentation' | 'Sports';
  description: string;
  fileUrl?: string;
  approvedBy?: mongoose.Types.ObjectId;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioItemSchema: Schema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ['Project', 'Certificate', 'Award', 'Artwork', 'Presentation', 'Sports'],
      required: true,
    },
    description: { type: String, required: true },
    fileUrl: { type: String },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  },
  { timestamps: true }
);

export default mongoose.models.PortfolioItem || mongoose.model<IPortfolioItem>('PortfolioItem', PortfolioItemSchema);
