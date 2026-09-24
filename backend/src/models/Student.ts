import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  studentId?: string;
  admissionNumber?: string;
  firstName: string;
  lastName: string;
  gender?: 'Male' | 'Female' | 'Other';
  dateOfBirth?: Date;
  grade?: string;
  classId?: mongoose.Types.ObjectId;
  sectionId?: mongoose.Types.ObjectId;
  bloodGroup?: string;
  medicalNotes?: string;
  emergencyContact?: string;
  studentPhoto?: string;
  transportId?: mongoose.Types.ObjectId;
  transportStopId?: mongoose.Types.ObjectId;
  parentId?: mongoose.Types.ObjectId;
  schoolId?: mongoose.Types.ObjectId;
  campusId?: mongoose.Types.ObjectId;
  enrollmentDate: Date;
  status: 'Active' | 'Inactive' | 'Graduated' | 'Transferred' | 'Withdrawn';
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema: Schema = new Schema(
  {
    studentId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      index: true,
    },
    admissionNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      index: true,
    },
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
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
    },
    dateOfBirth: {
      type: Date,
    },
    grade: {
      type: String,
      trim: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      index: true,
    },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
      index: true,
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    medicalNotes: {
      type: String,
      trim: true,
    },
    emergencyContact: {
      type: String,
      trim: true,
    },
    studentPhoto: {
      type: String,
      trim: true,
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
      ref: 'Parent',
      index: true,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
    },
    campusId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Graduated', 'Transferred', 'Withdrawn'],
      default: 'Active',
      index: true,
    },
  },
  { timestamps: true }
);

StudentSchema.index({ parentId: 1, status: 1 });
StudentSchema.index({ classId: 1, sectionId: 1, status: 1 });
StudentSchema.index({ firstName: 1, lastName: 1 });

export default mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);
