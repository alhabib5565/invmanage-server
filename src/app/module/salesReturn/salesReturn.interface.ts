import { Types } from 'mongoose';
export type TSaleReturnItem = {
  productName: string;
  product: Types.ObjectId;
  quantity: number;
  retrunSubTotal: number;
  isDeleted: boolean;
};
export type TSaleReturn = {
  returnID: string;
  sale: Types.ObjectId;
  returnDate: Date;
  warehouse: Types.ObjectId;
  supplier: Types.ObjectId;
  returnItems: TSaleReturnItem[];
  totalReturnAmount: number;
  notes?: string;
};
