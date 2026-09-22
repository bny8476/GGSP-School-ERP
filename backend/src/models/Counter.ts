import mongoose, { Schema, Document } from 'mongoose';

export interface ICounter extends Document {
  key: string;
  sequence: number;
  createdAt: Date;
  updatedAt: Date;
}

const CounterSchema: Schema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    sequence: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  { timestamps: true }
);

CounterSchema.index({ key: 1 }, { unique: true });

export default mongoose.model<ICounter>('Counter', CounterSchema);
