import mongoose, { Schema, Document } from 'mongoose';

export interface IAIQueryLog extends Document {
  user: mongoose.Types.ObjectId;
  role: string;
  query: string;
  response: string;
  category: string;
  createdAt: Date;
}

const AIQueryLogSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, required: true },
    query: { type: String, required: true },
    response: { type: String, required: true },
    category: { type: String, default: 'General' },
  },
  { timestamps: true }
);

export default mongoose.models.AIQueryLog || mongoose.model<IAIQueryLog>('AIQueryLog', AIQueryLogSchema);
