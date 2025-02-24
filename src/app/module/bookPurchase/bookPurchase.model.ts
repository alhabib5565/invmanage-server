import { model, Schema } from 'mongoose';
import { TBookPurchase } from './bookPurchase.interface';

const bookPurchaseSchema = new Schema<TBookPurchase>(
  {
    parchaseBookId: {
      type: String,
      required: true,
      unique: true,
    },
    book: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    author: {
      type: String,
      required: false,
    },
    publisher: {
      type: String,
      required: false,
    },
    quantityPurchased: {
      type: Number,
      required: true,
    },
    purchasePricePerUnit: {
      type: Number,
      required: true,
    },
    supplierName: {
      type: String,
      required: false,
    },
    purchaseDate: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

export const BookPurchase = model('BookPurchase', bookPurchaseSchema);
