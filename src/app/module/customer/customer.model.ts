import { model, Schema } from 'mongoose';
import { TCustomer } from './customer.interface';
import { Gender } from '../user/user.constant';

const CustomerSchema = new Schema<TCustomer>(
  {
    name: { type: String, required: true, minlength: 3 },
    customerID: { type: String, required: true, unique: true },
    mobileNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    companyName: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    gender: { type: String, enum: Gender, required: true },
    district: { type: String, required: true },
    thana: { type: String, required: true },
    homeAddress: { type: String, required: true },
    totalPurchased: { type: Number, default: 0 }, // Total buy kora amount
    totalPaid: { type: Number, default: 0 }, // Total pay kora amount
    totalDue: { type: Number, default: 0 }, // Remaining due
    salesExecutiveReference: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: false,
    },
  },
  { timestamps: true },
);

export const Customer = model('Customer', CustomerSchema);
