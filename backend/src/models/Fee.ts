import mongoose, { Schema, Document } from 'mongoose';

export interface IFee extends Document {
  studentId: mongoose.Types.ObjectId;
  grade: 'Pre-KG' | 'LKG' | 'UKG';
  feeType: 'Admission' | 'Tuition' | 'Transport' | 'Activity' | 'Day Care';
  totalAmount: number;
  amountPaid: number;
  dueDate: Date;
  status: 'Paid' | 'Partial' | 'Overdue' | 'Pending';
  createdAt: Date;
  updatedAt: Date;
}

const FeeSchema: Schema = new Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student', // Fixed from User to Student
      required: true,
    },
    grade: {
      type: String,
      enum: ['Pre-KG', 'LKG', 'UKG'],
      required: true,
    },
    feeType: {
      type: String,
      enum: ['Admission', 'Tuition', 'Transport', 'Activity', 'Day Care'],
      default: 'Tuition',
      required: true,
    },
    totalAmount: { type: Number, required: true },
    amountPaid: { type: Number, default: 0 },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['Paid', 'Partial', 'Overdue', 'Pending'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

FeeSchema.index({ studentId: 1, status: 1 });
FeeSchema.index({ dueDate: 1 });

export default mongoose.model<IFee>('Fee', FeeSchema);
