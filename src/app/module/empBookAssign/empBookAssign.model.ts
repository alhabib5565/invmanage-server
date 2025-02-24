import { model, Schema } from 'mongoose';
import { TEmpBookAssign } from './empBookAssign.interface';

const empBookAssignSchema = new Schema<TEmpBookAssign>(
  {
    assignId: {
      type: String,
      required: true,
      unique: true,
    },
    employee: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Employee',
    },
    book: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    quantityAssigned: { type: Number, required: true },
    pricePerUnit: { type: Number, required: true },
    assignDate: {
      type: Date,
      required: true,
    },
    totalPrice: {
      type: Number,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export const EmpBookAssign = model('EmpBookAssign', empBookAssignSchema);
