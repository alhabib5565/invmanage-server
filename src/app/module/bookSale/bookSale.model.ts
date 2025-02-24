import mongoose, { Schema } from 'mongoose';
import { TBookSale } from './bookSale.interface';

const bookSaleSchema = new Schema<TBookSale>(
  {
    saleId: {
      type: String,
      unique: true,
      required: true,
    },
    book: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    saleBy: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    totalQuantitySold: {
      type: Number,
      required: true,
    },
    sellingPricePerUnit: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paidAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    dueAmount: {
      type: Number,
      required: true,
      default: function () {
        return this.totalAmount - this.paidAmount;
      },
    },
    saleDate: {
      type: Date,
      default: Date.now,
    },

    saleType: {
      type: String,
      enum: ['Online', 'Offline'],
      required: true,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true },
);
export const BookSale = mongoose.model('BookSale', bookSaleSchema);
