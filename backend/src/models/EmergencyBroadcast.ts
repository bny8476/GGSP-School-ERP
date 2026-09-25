import mongoose, { Schema, Document } from 'mongoose';

export interface IEmergencyBroadcast extends Document {
  title: string;
  message: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  targetAudience: 'All' | 'Students' | 'Parents' | 'Teachers' | 'Staff';
  active: boolean;
  createdBy: mongoose.Types.ObjectId;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EmergencyBroadcastSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'High' },
    targetAudience: {
      type: String,
      enum: ['All', 'Students', 'Parents', 'Teachers', 'Staff'],
      default: 'All',
    },
    active: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.EmergencyBroadcast || mongoose.model<IEmergencyBroadcast>('EmergencyBroadcast', EmergencyBroadcastSchema);
