import mongoose, { Schema, Document } from 'mongoose';

export interface IVendorPO extends Document {
  poNumber: string;
  vendorName: string;
  vendorEmail?: string;
  campusId?: mongoose.Types.ObjectId;
  items: {
    name: string;
    quantity: number;
    unitPrice: number;
    total: number;
    receivedQuantity?: number;
  }[];
  totalAmount: number;
  taxAmount?: number;
  discountAmount?: number;
  status: 'Draft' | 'Pending' | 'Approved' | 'Sent' | 'Partially Received' | 'Received' | 'Cancelled';
  deliveryDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VendorPOSchema: Schema = new Schema(
  {
    poNumber: { type: String, required: true, unique: true, uppercase: true },
    vendorName: { type: String, required: true },
    vendorEmail: { type: String },
    campusId: { type: Schema.Types.ObjectId, ref: 'Campus' },
    items: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        total: { type: Number, required: true },
        receivedQuantity: { type: Number, default: 0 }
      }
    ],
    totalAmount: { type: Number, required: true },
    taxAmount: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['Draft', 'Pending', 'Approved', 'Sent', 'Partially Received', 'Received', 'Cancelled'],
      default: 'Draft'
    },
    deliveryDate: { type: Date },
    notes: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.VendorPO || mongoose.model<IVendorPO>('VendorPO', VendorPOSchema);
