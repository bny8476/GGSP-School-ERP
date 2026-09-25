import mongoose, { Schema, Document } from 'mongoose';

export interface IAssetManagement extends Document {
  assetCode: string;
  name: string;
  category: 'Computers' | 'Furniture' | 'Projectors' | 'Vehicles' | 'LabEquipment' | 'MedicalSupplies';
  campusId?: mongoose.Types.ObjectId;
  batchNo?: string;
  serialNo?: string;
  purchaseDate?: Date;
  purchasePrice?: number;
  qrCodeData?: string;
  assignedToUser?: mongoose.Types.ObjectId;
  assignedLocation?: string;
  amcVendor?: string;
  amcExpiryDate?: Date;
  status: 'In Use' | 'Under Maintenance' | 'Retired' | 'Stock';
  createdAt: Date;
  updatedAt: Date;
}

const AssetManagementSchema: Schema = new Schema(
  {
    assetCode: { type: String, required: true, unique: true, uppercase: true },
    name: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Computers', 'Furniture', 'Projectors', 'Vehicles', 'LabEquipment', 'MedicalSupplies']
    },
    campusId: { type: Schema.Types.ObjectId, ref: 'Campus' },
    batchNo: { type: String },
    serialNo: { type: String },
    purchaseDate: { type: Date },
    purchasePrice: { type: Number },
    qrCodeData: { type: String },
    assignedToUser: { type: Schema.Types.ObjectId, ref: 'User' },
    assignedLocation: { type: String },
    amcVendor: { type: String },
    amcExpiryDate: { type: Date },
    status: {
      type: String,
      enum: ['In Use', 'Under Maintenance', 'Retired', 'Stock'],
      default: 'Stock'
    }
  },
  { timestamps: true }
);

export default mongoose.models.AssetManagement || mongoose.model<IAssetManagement>('AssetManagement', AssetManagementSchema);
