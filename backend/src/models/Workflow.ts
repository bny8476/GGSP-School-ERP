import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkflowRule extends Document {
  name: string;
  triggerEvent: string;
  conditionModule: string;
  actionType: 'Notification' | 'Email' | 'TaskAssignment' | 'ApprovalRequired' | 'StatusUpdate';
  targetRole: string;
  isActive: boolean;
  executionCount: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const WorkflowRuleSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    triggerEvent: { type: String, required: true },
    conditionModule: { type: String, required: true },
    actionType: {
      type: String,
      enum: ['Notification', 'Email', 'TaskAssignment', 'ApprovalRequired', 'StatusUpdate'],
      required: true,
    },
    targetRole: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    executionCount: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.models.WorkflowRule || mongoose.model<IWorkflowRule>('WorkflowRule', WorkflowRuleSchema);
