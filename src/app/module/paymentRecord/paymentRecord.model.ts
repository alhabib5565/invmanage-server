import { model, Schema } from 'mongoose';
import { TPaymentRecord } from './paymentRecord.interface';

const PaymentRecordSchema = new Schema<TPaymentRecord>(
  {
    paymentId: { type: String, unique: true, required: true },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    sale: { type: Schema.Types.ObjectId, ref: 'BookSale', required: true },
    collectedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: false,
    }, // Sales Executive
    amount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Card', 'Bkash', 'Bank Transfer'],
      required: true,
      default: 'Cash',
    },
    isPaidDuringSale: { type: Boolean, default: false },
    isRetrun: { type: Boolean, default: false },
    paymentDate: { type: Date, default: Date.now },
    notes: { type: String },
  },
  { timestamps: true },
);

export const PaymentRecord = model('PaymentRecord', PaymentRecordSchema);
