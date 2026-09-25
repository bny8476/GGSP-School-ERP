import mongoose, { Schema, Document } from 'mongoose';

export interface IInventoryItem extends Document {
  itemName: string;
  category: 'Stationery' | 'Furniture' | 'Electronics' | 'Sports' | 'Lab' | 'General';
  quantity: number;
  unit: string;
  minThreshold: number;
  unitPrice: number;
  location?: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  createdAt: Date;
  updatedAt: Date;
}

const InventoryItemSchema: Schema = new Schema(
  {
    itemName: { type: String, required: true },
    category: {
      type: String,
      enum: ['Stationery', 'Furniture', 'Electronics', 'Sports', 'Lab', 'General'],
      default: 'General',
    },
    quantity: { type: Number, required: true, default: 0 },
    unit: { type: String, default: 'Pcs' },
    minThreshold: { type: Number, default: 10 },
    unitPrice: { type: Number, default: 0 },
    location: { type: String },
    status: {
      type: String,
      enum: ['In Stock', 'Low Stock', 'Out of Stock'],
      default: 'In Stock',
    },
  },
  { timestamps: true }
);

InventoryItemSchema.pre<IInventoryItem>('save', function () {
  if (this.quantity <= 0) {
    this.status = 'Out of Stock';
  } else if (this.quantity <= this.minThreshold) {
    this.status = 'Low Stock';
  } else {
    this.status = 'In Stock';
  }
});



export default mongoose.models.InventoryItem || mongoose.model<IInventoryItem>('InventoryItem', InventoryItemSchema);
