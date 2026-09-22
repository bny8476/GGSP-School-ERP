import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  firstName: string;
  lastName: string;
  grade?: string; // Legacy field
  classId?: mongoose.Types.ObjectId;
  sectionId?: mongoose.Types.ObjectId;
  admissionNumber?: string;
  bloodGroup?: string;
  medicalNotes?: string;
  emergencyContact?: string;
  studentPhoto?: string;
  transportId?: mongoose.Types.ObjectId;
  transportStopId?: mongoose.Types.ObjectId;
  parentId?: mongoose.Types.ObjectId;
  enrollmentDate: Date;
  status: 'Active' | 'Inactive' | 'Graduated';
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema: Schema = new Schema(
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
    grade: {
      type: String,
      enum: ['Pre-KG', 'LKG', 'UKG'],
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
    },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
    },
    admissionNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    medicalNotes: {
      type: String,
    },
    emergencyContact: {
      type: String,
    },
    studentPhoto: {
      type: String,
    },
    transportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TransportRoute',
    },
    transportStopId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Parent', // Updated to reference the new Parent model instead of User
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Graduated'],
      default: 'Active',
    },
  },
  { timestamps: true }
);

StudentSchema.index({ parentId: 1 });
StudentSchema.index({ classId: 1, sectionId: 1 });
StudentSchema.index({ admissionNumber: 1 });

export default mongoose.model<IStudent>('Student', StudentSchema);
