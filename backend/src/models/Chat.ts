import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage extends Document {
  sender: mongoose.Types.ObjectId;
  recipient?: mongoose.Types.ObjectId;
  room?: string;
  message: string;
  attachments?: string[];
  readBy: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema: Schema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: Schema.Types.ObjectId, ref: 'User' },
    room: { type: String },
    message: { type: String, required: true },
    attachments: [{ type: String }],
    readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export default mongoose.models.ChatMessage || mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);
