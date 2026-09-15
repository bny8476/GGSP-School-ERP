import mongoose, { Schema, Document } from 'mongoose';

export interface IDelegationSLA extends Document {
  delegatorId: mongoose.Types.ObjectId;
  delegateeId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  scope: string; // e.g. "Leave Approvals", "PO Approvals"
  reason?: string;
  slaHours: number; // e.g. 48 hours
  escalationLevel1User?: mongoose.Types.ObjectId;
  escalationLevel2User?: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DelegationSLASchema: Schema = new Schema(
  {
    delegatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    delegateeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    scope: { type: String, required: true },
    reason: { type: String },
    slaHours: { type: Number, default: 48 },
    escalationLevel1User: { type: Schema.Types.ObjectId, ref: 'User' },
    escalationLevel2User: { type: Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model<IDelegationSLA>('DelegationSLA', DelegationSLASchema);
