import { Types } from 'mongoose';

export type TPaymentRecord = {
  paymentId: string;
  customer: Types.ObjectId;
  sale: Types.ObjectId;
  collectedBy: Types.ObjectId;
  amount: number;
  paymentMethod: 'Cash' | 'Card' | 'Bkash' | 'Bank Transfer';
  isPaidDuringSale: boolean;
  isRetrun: boolean;
  paymentDate: Date;
  notes?: string; // Optional notes
  createdAt?: Date;
  updatedAt?: Date;
};
