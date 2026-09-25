import mongoose, { Schema, Document } from 'mongoose';

export interface IAcademicYear extends Document {
  name: string; // e.g. "2026-2027"
  campusId?: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'closed' | 'archived';
  isCurrent: boolean;
  copiedFromYearId?: mongoose.Types.ObjectId;
  checklist?: {
    pendingFeesResolved: boolean;
    examResultsPublished: boolean;
    libraryLoansReturned: boolean;
    hostelBedsDeallocated: boolean;
    studentsPromoted: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AcademicYearSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    campusId: { type: Schema.Types.ObjectId, ref: 'Campus' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['active', 'closed', 'archived'], default: 'active' },
    isCurrent: { type: Boolean, default: false },
    copiedFromYearId: { type: Schema.Types.ObjectId, ref: 'AcademicYear' },
    checklist: {
      pendingFeesResolved: { type: Boolean, default: false },
      examResultsPublished: { type: Boolean, default: false },
      libraryLoansReturned: { type: Boolean, default: false },
      hostelBedsDeallocated: { type: Boolean, default: false },
      studentsPromoted: { type: Boolean, default: false }
    }
  },
  { timestamps: true }
);

AcademicYearSchema.index({ campusId: 1, name: 1 });

export default mongoose.models.AcademicYear || mongoose.model<IAcademicYear>('AcademicYear', AcademicYearSchema);
