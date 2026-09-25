import mongoose, { Schema, Document } from 'mongoose';

export interface IApplicant {
  name: string;
  email: string;
  phone: string;
  resumeUrl?: string;
  status: 'Applied' | 'Screening' | 'Interview' | 'Selected' | 'Rejected';
  appliedDate: Date;
  notes?: string;
}

export interface IRecruitment extends Document {
  jobTitle: string;
  department: string;
  vacancies: number;
  requirements: string[];
  status: 'Open' | 'Closed' | 'On Hold';
  applicants: IApplicant[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const RecruitmentSchema: Schema = new Schema(
  {
    jobTitle: { type: String, required: true },
    department: { type: String, required: true },
    vacancies: { type: Number, required: true, default: 1 },
    requirements: [{ type: String }],
    status: { type: String, enum: ['Open', 'Closed', 'On Hold'], default: 'Open' },
    applicants: [
      {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        resumeUrl: { type: String },
        status: {
          type: String,
          enum: ['Applied', 'Screening', 'Interview', 'Selected', 'Rejected'],
          default: 'Applied',
        },
        appliedDate: { type: Date, default: Date.now },
        notes: { type: String },
      },
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Recruitment || mongoose.model<IRecruitment>('Recruitment', RecruitmentSchema);
