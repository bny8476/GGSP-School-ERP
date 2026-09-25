import mongoose, { Schema, Document } from 'mongoose';

export interface ITransport extends Document {
  studentId: mongoose.Types.ObjectId;
  routeNumber: string;
  pickupTime: Date;
  dropOffTime?: Date;
  authorizedPerson: {
    name: string;
    relationship: string;
    contactNumber: string;
    idVerified: boolean;
  };
  status: 'In Transit' | 'Dropped Off' | 'Picked Up By Parent' | 'Absent';
  date: Date;
  loggedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TransportSchema: Schema = new Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    routeNumber: { type: String, required: true },
    pickupTime: { type: Date, required: true },
    dropOffTime: { type: Date },
    authorizedPerson: {
      name: { type: String, required: true },
      relationship: { type: String, required: true },
      contactNumber: { type: String, required: true },
      idVerified: { type: Boolean, default: false },
    },
    status: {
      type: String,
      enum: ['In Transit', 'Dropped Off', 'Picked Up By Parent', 'Absent'],
      default: 'In Transit',
    },
    date: { type: Date, required: true, default: Date.now },
    loggedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Transport || mongoose.model<ITransport>('Transport', TransportSchema);
