import mongoose, { Schema, Document } from 'mongoose';

export interface INoteComment {
  id: string;
  authorName: string;
  authorRole: string;
  text: string;
  createdAt: Date;
}

export interface INote extends Document {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;
  authorName?: string;
  authorRole?: string;
  category: 'Academic' | 'Staff' | 'Curriculum' | 'Safety' | 'Meeting Minutes' | 'General';
  privacy: 'private' | 'executive_board' | 'public_staff';
  isPinned: boolean;
  isArchived: boolean;
  tags?: string[];
  color?: string;
  comments: INoteComment[];
  createdAt: Date;
  updatedAt: Date;
}

const NoteCommentSchema = new Schema(
  {
    id: { type: String, required: true },
    authorName: { type: String, required: true },
    authorRole: { type: String, default: 'Leadership' },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const NoteSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    authorName: { type: String, default: 'Super Admin' },
    authorRole: { type: String, default: 'Executive Administration' },
    category: {
      type: String,
      enum: ['Academic', 'Staff', 'Curriculum', 'Safety', 'Meeting Minutes', 'General'],
      default: 'General',
    },
    privacy: {
      type: String,
      enum: ['private', 'executive_board', 'public_staff'],
      default: 'private',
    },
    isPinned: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    tags: [{ type: String }],
    color: { type: String, default: '#FFFFFF' },
    comments: [NoteCommentSchema],
  },
  { timestamps: true }
);

NoteSchema.index({ privacy: 1, category: 1, isPinned: -1 });

export default mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);
