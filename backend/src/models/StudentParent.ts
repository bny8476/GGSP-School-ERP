import mongoose, { Schema, Document } from 'mongoose';

export interface IStudentParent extends Document {
  studentId: mongoose.Types.ObjectId;
  parentId: mongoose.Types.ObjectId;
  relationship: 'Father' | 'Mother' | 'Guardian' | 'Other';
  isPrimary: boolean;
  canPickup: boolean;
  receivesNotifications: boolean;
  emergencyContact: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StudentParentSchema: Schema = new Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      index: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Parent',
      required: true,
      index: true,
    },
    relationship: {
      type: String,
      enum: ['Father', 'Mother', 'Guardian', 'Other'],
      default: 'Guardian',
      required: true,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
    canPickup: {
      type: Boolean,
      default: true,
    },
    receivesNotifications: {
      type: Boolean,
      default: true,
    },
    emergencyContact: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate junction links between same student and parent
StudentParentSchema.index({ studentId: 1, parentId: 1 }, { unique: true });

export default mongoose.model<IStudentParent>('StudentParent', StudentParentSchema);
