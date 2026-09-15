import mongoose, { Schema, Document } from 'mongoose';

export interface IVisitorLog extends Document {
  passNumber: string;
  visitorName: string;
  phone: string;
  purpose: string;
  personToMeet: string;
  checkInTime: Date;
  checkOutTime?: Date;
  idProofNumber?: string;
  status: 'Checked In' | 'Checked Out' | 'Denied';
  registeredBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const VisitorLogSchema: Schema = new Schema(
  {
    passNumber: { type: String, required: true, unique: true },
    visitorName: { type: String, required: true },
    phone: { type: String, required: true },
    purpose: { type: String, required: true },
    personToMeet: { type: String, required: true },
    checkInTime: { type: Date, default: Date.now },
    checkOutTime: { type: Date },
    idProofNumber: { type: String },
    status: { type: String, enum: ['Checked In', 'Checked Out', 'Denied'], default: 'Checked In' },
    registeredBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IVisitorLog>('VisitorLog', VisitorLogSchema);
