import { Types } from 'mongoose';

export type TPaymentRecord = {
  paymentId: string;
  customer: Types.ObjectId;
  sale: Types.ObjectId;
  collectedBy: Types.ObjectId;
  amountCollected: number;
  paymentMethod: 'Cash' | 'Card' | 'Bkash' | 'Bank Transfer';
  paymentDate: Date;
  notes?: string; // Optional notes
  createdAt?: Date; // Added by timestamps
  updatedAt?: Date; // Added by timestamps
};
