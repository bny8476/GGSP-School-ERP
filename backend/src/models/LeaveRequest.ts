import mongoose, { Schema, Document } from 'mongoose';

export interface ILeaveRequest extends Document {
  userId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  reason: string;
  leaveType?: 'Casual' | 'Sick' | 'Earned' | 'Maternity' | 'Official Duty' | 'Other';
  sessionType?: 'Full Day' | 'Half Day (Forenoon)' | 'Half Day (Afternoon)';
  daysCount?: number;
  substituteTeacher?: string;
  substituteStatus?: 'Pending' | 'Accepted' | 'Declined';
  adminRemark?: string;
  attachmentName?: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const LeaveRequestSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    leaveType: {
      type: String,
      enum: ['Casual', 'Sick', 'Earned', 'Maternity', 'Official Duty', 'Other'],
      default: 'Casual',
    },
    sessionType: {
      type: String,
      enum: ['Full Day', 'Half Day (Forenoon)', 'Half Day (Afternoon)'],
      default: 'Full Day',
    },
    daysCount: {
      type: Number,
      default: 1,
    },
    substituteTeacher: {
      type: String,
      default: '',
    },
    substituteStatus: {
      type: String,
      enum: ['Pending', 'Accepted', 'Declined'],
      default: 'Pending',
    },
    adminRemark: {
      type: String,
      default: '',
    },
    attachmentName: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model<ILeaveRequest>('LeaveRequest', LeaveRequestSchema);
