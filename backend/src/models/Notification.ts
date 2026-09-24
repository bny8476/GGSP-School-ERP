import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  recipient?: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId; // Backward compatibility alias
  targetRole?: string;
  studentId?: mongoose.Types.ObjectId;
  entityType?: string;
  entityId?: mongoose.Types.ObjectId | string;
  title: string;
  message: string;
  type: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  read: boolean;
  readAt?: Date;
  link?: string;
  metadata?: Record<string, any>;
  schoolId?: mongoose.Types.ObjectId;
  campusId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    targetRole: {
      type: String,
      index: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      index: true,
    },
    entityType: {
      type: String,
    },
    entityId: {
      type: Schema.Types.Mixed,
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
      default: 'announcement',
      index: true,
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
      index: true,
    },
    readAt: {
      type: Date,
    },
    link: {
      type: String,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
    },
    campusId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Pre-save hook to keep recipient and userId synchronized
NotificationSchema.pre('save', function () {
  if (this.recipient && !this.userId) {
    this.userId = this.recipient;
  } else if (this.userId && !this.recipient) {
    this.recipient = this.userId;
  }
  if (this.read && !this.readAt) {
    this.readAt = new Date();
  }
});

NotificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ targetRole: 1, createdAt: -1 });

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
