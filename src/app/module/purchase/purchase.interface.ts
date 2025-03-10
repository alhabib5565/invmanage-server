import { Types } from 'mongoose';
// import { TTaxType } from '../../interface/golobal';

export type TPurchaseItem = {
  name: string;
  code: string;
  product: Types.ObjectId;
  productCost: number;
  taxType: 'inclusive' | 'exclusive';
  taxRate: number;
  taxAmount: number;
  discountAmount: number;
  quantity: number;
  subTotal: number;
};

export type TPurchase = {
  purchaseDate: Date;
  purchaseId: string;
  warehouse: Types.ObjectId;
  supplier: Types.ObjectId;
  discount: number;
  taxRate: number;
  taxAmount: number;
  items: TPurchaseItem[];
  totalPurchaseAmount: number;
  paidAmount: number;
  dueAmount: number;
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Partial' | 'Pending';

  notes?: string;
};
