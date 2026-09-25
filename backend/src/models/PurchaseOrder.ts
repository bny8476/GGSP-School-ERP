import mongoose, { Schema, Document } from 'mongoose';

export interface IPOItem {
  itemName: string;
  quantity: number;
  estimatedPrice: number;
}

export interface IPurchaseOrder extends Document {
  poNumber: string;
  vendorName: string;
  items: IPOItem[];
  totalCost: number;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Received' | 'Cancelled';
  requestedBy: mongoose.Types.ObjectId;
  approvedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PurchaseOrderSchema: Schema = new Schema(
  {
    poNumber: { type: String, required: true, unique: true },
    vendorName: { type: String, required: true },
    items: [
      {
        itemName: { type: String, required: true },
        quantity: { type: Number, required: true },
        estimatedPrice: { type: Number, required: true },
      },
    ],
    totalCost: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Draft', 'Pending Approval', 'Approved', 'Received', 'Cancelled'],
      default: 'Pending Approval',
    },
    requestedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.models.PurchaseOrder || mongoose.model<IPurchaseOrder>('PurchaseOrder', PurchaseOrderSchema);
