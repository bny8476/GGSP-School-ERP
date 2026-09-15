import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
  isbn: string;
  title: string;
  author: string;
  publisher?: string;
  category: string;
  quantity: number;
  availableQuantity: number;
  shelfLocation?: string;
  price?: number;
  createdAt: Date;
  updatedAt: Date;
}

const BookSchema: Schema = new Schema(
  {
    isbn: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    publisher: {
      type: String,
    },
    category: {
      type: String,
      default: 'General',
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    availableQuantity: {
      type: Number,
      required: true,
      default: 1,
    },
    shelfLocation: {
      type: String,
    },
    price: {
      type: Number,
    },
  },
  { timestamps: true }
);

BookSchema.index({ title: 1, author: 1 });
BookSchema.index({ category: 1 });

export default mongoose.model<IBook>('Book', BookSchema);
