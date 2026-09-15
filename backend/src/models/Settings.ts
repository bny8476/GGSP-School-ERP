import mongoose, { Schema, Document } from 'mongoose';

export interface ISystemSettings extends Document {
  schoolName: string;
  schoolTagline?: string;
  schoolEmail?: string;
  schoolPhone?: string;
  schoolAddress?: string;
  academicYear: string;
  currency: string;
  timezone: string;
  language: string;
  enableSMS: boolean;
  enableEmailNotifications: boolean;
  paymentGatewayKey?: string;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SystemSettingsSchema: Schema = new Schema(
  {
    schoolName: { type: String, required: true, default: 'Global International School' },
    schoolTagline: { type: String, default: 'Excellence in Education' },
    schoolEmail: { type: String, default: 'contact@globalinternationalschool.edu' },
    schoolPhone: { type: String, default: '+1 (800) 555-GLOBAL' },
    schoolAddress: { type: String, default: '123 Education Boulevard, Knowledge City' },
    academicYear: { type: String, default: '2026-2027' },
    currency: { type: String, default: 'USD' },
    timezone: { type: String, default: 'UTC' },
    language: { type: String, default: 'en' },
    enableSMS: { type: Boolean, default: true },
    enableEmailNotifications: { type: Boolean, default: true },
    paymentGatewayKey: { type: String, default: '' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.models.SystemSettings ||
  mongoose.model<ISystemSettings>('SystemSettings', SystemSettingsSchema);
