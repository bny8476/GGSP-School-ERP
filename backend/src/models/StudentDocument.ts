import mongoose, { Schema, Document } from 'mongoose';

export interface IStudentDocument extends Document {
  studentId: mongoose.Types.ObjectId;
  title: string;
  category: 'Birth Certificate' | 'ID Proof' | 'Transfer Certificate' | 'Previous School Records' | 'Medical Certificate' | 'Address Proof' | 'Academic Certificate';
  documentUrl: string;
  expiryDate?: Date;
  verificationStatus: 'Pending' | 'Verified' | 'Rejected' | 'Expired';
  verifiedBy?: mongoose.Types.ObjectId;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const StudentDocumentSchema: Schema = new Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Birth Certificate', 'ID Proof', 'Transfer Certificate', 'Previous School Records', 'Medical Certificate', 'Address Proof', 'Academic Certificate'],
      required: true,
    },
    documentUrl: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: Date,
    },
    verificationStatus: {
      type: String,
      enum: ['Pending', 'Verified', 'Rejected', 'Expired'],
      default: 'Pending',
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rejectionReason: {
      type: String,
    },
  },
  { timestamps: true }
);

StudentDocumentSchema.index({ studentId: 1, category: 1 });

export default mongoose.models.StudentDocument || mongoose.model<IStudentDocument>('StudentDocument', StudentDocumentSchema);
