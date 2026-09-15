import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmission extends Document {
  applicationNumber: string;
  childFirstName: string;
  childLastName: string;
  dateOfBirth: Date;
  gender: 'Male' | 'Female' | 'Other';
  parentName: string;
  contactNumber: string;
  email: string;
  address: string;
  gradeAppliedFor: string;
  status: 'New Inquiry' | 'Follow-up Pending' | 'Demo Class Scheduled' | 'Interested' | 'Admission Confirmed' | 'Not Interested';
  stage: 'Application' | 'Submitted' | 'Under Review' | 'Interview' | 'Document Verification' | 'Approved' | 'Fee Pending' | 'Enrolled' | 'Rejected';
  interviewDate?: Date;
  interviewNotes?: string;
  admissionScore?: number;
  waitlistPosition?: number;
  notes?: string;
  documents?: { name: string; url: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const AdmissionSchema: Schema = new Schema(
  {
    applicationNumber: {
      type: String,
    },
    childFirstName: { type: String, required: true },
    childLastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    parentName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    gradeAppliedFor: { type: String, required: true },
    status: {
      type: String,
      default: 'New Inquiry',
    },
    stage: {
      type: String,
      enum: ['Application', 'Submitted', 'Under Review', 'Interview', 'Document Verification', 'Approved', 'Fee Pending', 'Enrolled', 'Rejected'],
      default: 'Submitted',
    },
    interviewDate: { type: Date },
    interviewNotes: { type: String },
    admissionScore: { type: Number },
    waitlistPosition: { type: Number },
    notes: { type: String },
    documents: [
      {
        name: { type: String },
        url: { type: String },
      },
    ],
  },
  { timestamps: true }
);

AdmissionSchema.index({ applicationNumber: 1 });
AdmissionSchema.index({ stage: 1, createdAt: -1 });

export default mongoose.model<IAdmission>('Admission', AdmissionSchema);
