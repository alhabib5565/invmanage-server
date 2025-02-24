import { Types } from 'mongoose';

export type TBookSale = {
  saleId: string;
  book: Types.ObjectId;
  customer: Types.ObjectId;
  saleBy: Types.ObjectId;
  totalQuantitySold: number;
  sellingPricePerUnit: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  saleDate: Date;
  saleType: 'Online' | 'Offline';
  notes?: string;
};
