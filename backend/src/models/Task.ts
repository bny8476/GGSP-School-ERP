import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description?: string;
  assignedTo?: mongoose.Types.ObjectId;
  assigneeId?: mongoose.Types.ObjectId;
  assigneeName?: string;
  assigneeRole?: string;
  assigneeEmail?: string;
  department?: string;
  createdBy: mongoose.Types.ObjectId;
  assignedById?: mongoose.Types.ObjectId;
  assignedByName?: string;
  dueDate?: Date;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Pending' | 'Assigned' | 'In Progress' | 'Pending Review' | 'Completed' | 'Escalated';
  category?: string;
  tags?: string[];
  slaHours: number;
  isEscalated: boolean;
  escalationReason?: string;
  erpTriggerSource?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    assigneeId: { type: Schema.Types.ObjectId, ref: 'User' },
    assigneeName: { type: String },
    assigneeRole: { type: String },
    assigneeEmail: { type: String },
    department: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assignedById: { type: Schema.Types.ObjectId, ref: 'User' },
    assignedByName: { type: String },
    dueDate: { type: Date },
    priority: { 
      type: String, 
      enum: ['Low', 'Medium', 'High', 'Urgent'], 
      default: 'Medium' 
    },
    status: { 
      type: String, 
      enum: ['Pending', 'Assigned', 'In Progress', 'Pending Review', 'Completed', 'Escalated'], 
      default: 'Pending' 
    },
    category: { type: String, default: 'Academic' },
    tags: [{ type: String }],
    slaHours: { type: Number, default: 48 },
    isEscalated: { type: Boolean, default: false },
    escalationReason: { type: String },
    erpTriggerSource: { type: String },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

// Helpful index for queries
TaskSchema.index({ status: 1, priority: 1, dueDate: 1 });
TaskSchema.index({ assigneeId: 1 });

export default mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);
