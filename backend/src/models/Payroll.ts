import mongoose, { Schema, Document } from 'mongoose';

export interface IPayroll extends Document {
  staffId: mongoose.Types.ObjectId;
  month: string; // e.g., "June 2026"
  baseSalary: number;
  attendanceDays: number;
  deductions: number;
  bonuses: number;
  netSalary: number;
  status: 'Pending' | 'Paid';
  paymentDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PayrollSchema: Schema = new Schema(
  {
    staffId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    month: { type: String, required: true },
    baseSalary: { type: Number, required: true },
    attendanceDays: { type: Number, required: true, default: 30 },
    deductions: { type: Number, default: 0 },
    bonuses: { type: Number, default: 0 },
    netSalary: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['Pending', 'Paid'],
      default: 'Pending'
    },
    paymentDate: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Payroll || mongoose.model<IPayroll>('Payroll', PayrollSchema);
