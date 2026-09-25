import mongoose, { Schema, Document } from 'mongoose';

export interface IFinancialPeriod extends Document {
  fiscalYear: string; // e.g. "FY2026-2027"
  periodName: string; // e.g. "Q1 FY26"
  campusId?: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  isLocked: boolean;
  lockedBy?: mongoose.Types.ObjectId;
  lockedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const FinancialPeriodSchema: Schema = new Schema(
  {
    fiscalYear: { type: String, required: true },
    periodName: { type: String, required: true },
    campusId: { type: Schema.Types.ObjectId, ref: 'Campus' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isLocked: { type: Boolean, default: false },
    lockedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    lockedAt: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.models.FinancialPeriod || mongoose.model<IFinancialPeriod>('FinancialPeriod', FinancialPeriodSchema);
