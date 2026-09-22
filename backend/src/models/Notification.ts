import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId?: mongoose.Types.ObjectId;
  targetRole?: string;
  studentId?: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type:
    | 'attendance'
    | 'fee'
    | 'admission'
    | 'exam'
    | 'homework'
    | 'leave'
    | 'payroll'
    | 'announcement'
    | 'event'
    | 'transport'
    | 'library'
    | 'support'
    | 'security'
    | 'classwork'
    | 'activity'
    | 'remark'
    | 'diary'
    | 'assessment'
    | 'notice';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  read: boolean;
  link?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    targetRole: {
      type: String,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: [
        'attendance',
        'fee',
        'admission',
        'exam',
        'homework',
        'leave',
        'payroll',
        'announcement',
        'event',
        'transport',
        'library',
        'support',
        'security',
        'classwork',
        'activity',
        'remark',
        'diary',
        'assessment',
        'notice',
      ],
      default: 'announcement',
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal',
    },
    read: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ targetRole: 1, createdAt: -1 });

export default mongoose.model<INotification>('Notification', NotificationSchema);
