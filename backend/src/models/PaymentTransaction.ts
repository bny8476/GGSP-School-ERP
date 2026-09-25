import mongoose, { Schema, Document } from 'mongoose';

export interface IPaymentTransaction extends Document {
  transactionId: string;
  orderId: string;
  paymentId?: string;
  feeId: mongoose.Types.ObjectId;
  studentId?: mongoose.Types.ObjectId;
  payerId?: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  gateway: string;
  status: 'Created' | 'Success' | 'Failed' | 'Signature_Mismatch';
  failureReason?: string;
  rawPayload?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentTransactionSchema: Schema = new Schema(
  {
    transactionId: { type: String, required: true, unique: true, index: true },
    orderId: { type: String, required: true, index: true },
    paymentId: { type: String, index: true },
    feeId: { type: Schema.Types.ObjectId, ref: 'Fee', required: true, index: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student' },
    payerId: { type: Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    gateway: { type: String, default: 'Razorpay' },
    status: {
      type: String,
      enum: ['Created', 'Success', 'Failed', 'Signature_Mismatch'],
      default: 'Created',
      index: true,
    },
    failureReason: { type: String },
    rawPayload: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default mongoose.models.PaymentTransaction ||
  mongoose.model<IPaymentTransaction>('PaymentTransaction', PaymentTransactionSchema);
