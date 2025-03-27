import { Types } from 'mongoose';
export type TPurchaseReturnItem = {
  productName: string;
  code: string;
  product: Types.ObjectId;
  productCost: number;
  productPrice: number;
  netUnitPrice: number;
  taxType: 'inclusive' | 'exclusive';
  productTaxRate: number;
  taxAmount: number;
  discountAmount: number;
  quantity: number;
  subTotal: number;
  isDeleted: boolean;
};
export type TPurchaseReturn = {
  returnID: string;
  purchase: Types.ObjectId;
  returnDate: Date;
  warehouse: Types.ObjectId;
  supplier: Types.ObjectId;
  returnItems: TPurchaseReturnItem[];
  totalReturnAmount: number;
  notes?: string;
};
