import mongoose, { Schema, Document } from 'mongoose';

export interface IEmail extends Document {
  sender: string;
  senderEmail: string;
  recipients: string[];
  recipientGroups?: string[];
  subject: string;
  preview: string;
  body: string;
  html?: string;
  category: 'fee_reminder' | 'admission_letter' | 'report_card' | 'disciplinary_memo' | 'general_notice';
  folder: 'inbox' | 'sent' | 'drafts' | 'trash';
  priority: 'normal' | 'high';
  status: 'delivered' | 'pending' | 'failed' | 'simulated';
  messageId: string;
  starred: boolean;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EmailSchema: Schema = new Schema(
  {
    sender: { type: String, required: true },
    senderEmail: { type: String, required: true },
    recipients: [{ type: String, required: true }],
    recipientGroups: [{ type: String }],
    subject: { type: String, required: true },
    preview: { type: String, default: '' },
    body: { type: String, required: true },
    html: { type: String },
    category: {
      type: String,
      enum: ['fee_reminder', 'admission_letter', 'report_card', 'disciplinary_memo', 'general_notice'],
      default: 'general_notice',
    },
    folder: {
      type: String,
      enum: ['inbox', 'sent', 'drafts', 'trash'],
      default: 'sent',
    },
    priority: {
      type: String,
      enum: ['normal', 'high'],
      default: 'normal',
    },
    status: {
      type: String,
      enum: ['delivered', 'pending', 'failed', 'simulated'],
      default: 'delivered',
    },
    messageId: { type: String },
    starred: { type: Boolean, default: false },
    read: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Email || mongoose.model<IEmail>('Email', EmailSchema);
