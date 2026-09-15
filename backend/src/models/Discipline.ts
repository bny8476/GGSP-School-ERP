import mongoose, { Schema, Document } from 'mongoose';

export interface IDisciplineIncident extends Document {
  student: mongoose.Types.ObjectId;
  category: 'Behavioral' | 'Academic Dishonesty' | 'Attendance' | 'Vandalism' | 'Bullying' | 'Other';
  severity: 'Low' | 'Medium' | 'High' | 'Severe';
  incidentDate: Date;
  location?: string;
  description: string;
  reportedBy: mongoose.Types.ObjectId;
  actionTaken: string;
  parentNotified: boolean;
  status: 'Open' | 'Under Investigation' | 'Resolved' | 'Closed';
  createdAt: Date;
  updatedAt: Date;
}

const DisciplineIncidentSchema: Schema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    category: {
      type: String,
      enum: ['Behavioral', 'Academic Dishonesty', 'Attendance', 'Vandalism', 'Bullying', 'Other'],
      required: true,
    },
    severity: { type: String, enum: ['Low', 'Medium', 'High', 'Severe'], default: 'Medium' },
    incidentDate: { type: Date, default: Date.now },
    location: { type: String },
    description: { type: String, required: true },
    reportedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    actionTaken: { type: String, required: true },
    parentNotified: { type: Boolean, default: false },
    status: { type: String, enum: ['Open', 'Under Investigation', 'Resolved', 'Closed'], default: 'Open' },
  },
  { timestamps: true }
);

export default mongoose.models.DisciplineIncident ||
  mongoose.model<IDisciplineIncident>('DisciplineIncident', DisciplineIncidentSchema);
