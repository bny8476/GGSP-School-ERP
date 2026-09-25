import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  description: string;
  category: 'Payroll' | 'Utilities' | 'Supplies' | 'Maintenance' | 'Other';
  amount: number;
  date: Date;
  recordedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema: Schema = new Schema(
  {
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['Payroll', 'Utilities', 'Supplies', 'Maintenance', 'Other'],
      required: true,
    },
    amount: { type: Number, required: true },
    date: { type: Date, required: true, default: Date.now },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);
