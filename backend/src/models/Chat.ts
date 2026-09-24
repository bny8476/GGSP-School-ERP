import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage extends Document {
  conversationId?: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  senderRole?: 'Teacher' | 'Parent' | 'SuperAdmin' | 'Admin' | string;
  recipient?: mongoose.Types.ObjectId;
  studentId?: mongoose.Types.ObjectId;
  schoolId?: mongoose.Types.ObjectId;
  campusId?: mongoose.Types.ObjectId;
  room?: string;
  message: string;
  messageType?: 'text' | 'image' | 'file' | 'system';
  attachments?: string[];
  status?: 'sent' | 'delivered' | 'read';
  readBy: mongoose.Types.ObjectId[];
  readAt?: Date;
  clientTempId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema: Schema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      index: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    senderRole: {
      type: String,
      default: 'Teacher',
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      index: true,
    },
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: 'Campus',
    },
    campusId: {
      type: Schema.Types.ObjectId,
      ref: 'Campus',
    },
    room: {
      type: String,
      index: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    messageType: {
      type: String,
      enum: ['text', 'image', 'file', 'system'],
      default: 'text',
    },
    attachments: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read'],
      default: 'sent',
      index: true,
    },
    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    readAt: {
      type: Date,
    },
    clientTempId: {
      type: String,
      index: true,
    },
  },
  { timestamps: true }
);

// Compound indexes for optimal queries
ChatMessageSchema.index({ conversationId: 1, createdAt: 1 });
ChatMessageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });
ChatMessageSchema.index({ recipient: 1, status: 1 });

export default mongoose.models.ChatMessage || mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);
