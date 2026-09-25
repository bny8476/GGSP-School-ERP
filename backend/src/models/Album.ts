import mongoose, { Schema, Document } from 'mongoose';

export interface IAlbum extends Document {
  title: string;
  description?: string;
  date: Date;
  mediaUrls: string[]; // URLs or paths to photos/videos
  visibility: 'All' | 'Parents' | 'Staff';
  createdAt: Date;
  updatedAt: Date;
}

const AlbumSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true, default: Date.now },
    mediaUrls: [{ type: String }],
    visibility: { 
      type: String, 
      enum: ['All', 'Parents', 'Staff'],
      default: 'All'
    },
  },
  { timestamps: true }
);

export default mongoose.models.Album || mongoose.model<IAlbum>('Album', AlbumSchema);
