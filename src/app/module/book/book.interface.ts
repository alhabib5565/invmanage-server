import { Types } from 'mongoose';

export type TBook = {
  bookTitle: string;
  bookID: string;
  bookImage?: string;
  createdBy: Types.ObjectId;
};
