import { model, Schema } from 'mongoose';
import { TBook } from './book.interface';

const BookSchema = new Schema<TBook>(
  {
    bookTitle: { type: String, required: true },
    bookID: { type: String, required: true, unique: true },
    bookImage: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

export const Book = model('Book', BookSchema);
