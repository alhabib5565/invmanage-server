import { Types } from 'mongoose';

export type TEmpBookAssign = {
  assignId: string;
  employee: Types.ObjectId;
  book: Types.ObjectId;
  quantityAssigned: number;
  pricePerUnit: number;
  assignDate: Date;
  totalPrice: number;
  notes?: string;
};
