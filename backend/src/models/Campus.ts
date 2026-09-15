import mongoose, { Schema, Document } from 'mongoose';

export interface ICampus extends Document {
  name: string;
  code: string;
  address: string;
  city?: string;
  state?: string;
  country?: string;
  contactPhone?: string;
  email?: string;
  principalName?: string;
  logoUrl?: string;
  workingHours?: string;
  holidays?: { date: Date; reason: string }[];
  settings?: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CampusSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    address: { type: String, required: true },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    contactPhone: { type: String },
    email: { type: String },
    principalName: { type: String },
    logoUrl: { type: String },
    workingHours: { type: String, default: '08:00 AM - 04:00 PM' },
    holidays: [
      {
        date: { type: Date },
        reason: { type: String }
      }
    ],
    settings: { type: Schema.Types.Mixed, default: {} },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

CampusSchema.index({ code: 1 });

export default mongoose.model<ICampus>('Campus', CampusSchema);
