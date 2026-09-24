import mongoose, { Schema, Document } from 'mongoose';

export interface ILastMessage {
  _id?: string;
  message: string;
  senderId: mongoose.Types.ObjectId;
  senderRole: string;
  createdAt: Date;
}

export interface IConversation extends Document {
  schoolId?: mongoose.Types.ObjectId;
  campusId?: mongoose.Types.ObjectId;
  studentId?: mongoose.Types.ObjectId;
  parentId: mongoose.Types.ObjectId;
  teacherId: mongoose.Types.ObjectId;
  participants: mongoose.Types.ObjectId[];
  lastMessage?: ILastMessage;
  lastMessageAt?: Date;
  unreadCounts: Record<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema: Schema = new Schema(
  {
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: 'Campus',
      index: true,
    },
    campusId: {
      type: Schema.Types.ObjectId,
      ref: 'Campus',
      index: true,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      index: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    lastMessage: {
      _id: { type: String },
      message: { type: String },
      senderId: { type: Schema.Types.ObjectId, ref: 'User' },
      senderRole: { type: String },
      createdAt: { type: Date },
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    unreadCounts: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

// Compound unique index ensuring one stable conversation per parent + teacher + student
ConversationSchema.index({ parentId: 1, teacherId: 1, studentId: 1 }, { unique: true });
ConversationSchema.index({ participants: 1 });

export default mongoose.models.Conversation || mongoose.model<IConversation>('Conversation', ConversationSchema);
