import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  type: 'Annual Day' | 'Sports Day' | 'Fancy Dress' | 'Field Trip' | 'Parent Meeting' | 'Holiday' | 'Other';
  date: Date;
  time?: string;
  audience: 'All' | 'Parents' | 'Staff' | 'Students';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['Annual Day', 'Sports Day', 'Fancy Dress', 'Field Trip', 'Parent Meeting', 'Holiday', 'Other'],
      required: true
    },
    date: { type: Date, required: true },
    time: { type: String },
    audience: { 
      type: String, 
      enum: ['All', 'Parents', 'Staff', 'Students'],
      default: 'All'
    },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
