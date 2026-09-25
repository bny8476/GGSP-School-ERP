import mongoose, { Schema, Document } from 'mongoose';

export interface IHostelRoom extends Document {
  hostelName: string;
  roomNumber: string;
  roomType: 'Single' | 'Double' | 'Triple' | 'Dormitory';
  capacity: number;
  occupancy: number;
  costPerTerm: number;
  assignedStudents: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const HostelRoomSchema: Schema = new Schema(
  {
    hostelName: {
      type: String,
      required: true,
      trim: true,
    },
    roomNumber: {
      type: String,
      required: true,
      trim: true,
    },
    roomType: {
      type: String,
      enum: ['Single', 'Double', 'Triple', 'Dormitory'],
      default: 'Double',
    },
    capacity: {
      type: Number,
      required: true,
      default: 2,
    },
    occupancy: {
      type: Number,
      default: 0,
    },
    costPerTerm: {
      type: Number,
      required: true,
      default: 0,
    },
    assignedStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
      },
    ],
  },
  { timestamps: true }
);

HostelRoomSchema.index({ hostelName: 1, roomNumber: 1 }, { unique: true });

export default mongoose.models.HostelRoom || mongoose.model<IHostelRoom>('HostelRoom', HostelRoomSchema);
