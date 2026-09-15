import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: mongoose.Types.ObjectId;
  isActive: boolean;
  phoneNumber?: string;
  salary?: number;
  designation?: string;
  qualification?: string;
  experienceYears?: number;
  performanceNotes?: string;
  joinDate?: Date;
  teachingAssignments?: {
    classId: mongoose.Types.ObjectId;
    subjectId: mongoose.Types.ObjectId;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    phoneNumber: {
      type: String,
    },
    salary: {
      type: Number,
    },
    designation: {
      type: String,
    },
    qualification: {
      type: String,
    },
    experienceYears: {
      type: Number,
    },
    performanceNotes: {
      type: String,
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    teachingAssignments: [
      {
        classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
        subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }
      }
    ],
  },
  { timestamps: true }
);

UserSchema.index({ role: 1 });

export default mongoose.model<IUser>('User', UserSchema);
