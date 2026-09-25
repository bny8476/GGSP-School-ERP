import mongoose, { Schema, Document } from 'mongoose';

export interface IParent extends Document {
  fatherName: string;
  fatherOccupation?: string;
  fatherContact?: string;
  motherName: string;
  motherOccupation?: string;
  motherContact?: string;
  guardianName?: string;
  guardianContact?: string;
  primaryEmail: string;
  address: string;
  whatsappNumber?: string;
  userId?: mongoose.Types.ObjectId; // If they have portal access
  createdAt: Date;
  updatedAt: Date;
}

const ParentSchema: Schema = new Schema(
  {
    fatherName: { type: String, required: true },
    fatherOccupation: { type: String },
    fatherContact: { type: String },
    motherName: { type: String, required: true },
    motherOccupation: { type: String },
    motherContact: { type: String },
    guardianName: { type: String },
    guardianContact: { type: String },
    primaryEmail: { type: String, required: true },
    address: { type: String, required: true },
    whatsappNumber: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.models.Parent || mongoose.model<IParent>('Parent', ParentSchema);
