import { Types } from 'mongoose';
// import { TTaxType } from '../../interface/golobal';

export type TPurchaseItem = {
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

export type TPurchase = {
  purchaseDate: Date;
  purchaseId: string;
  warehouse: Types.ObjectId;
  supplier: Types.ObjectId;
  discountAmount: number;
  taxRate: number;
  shipping: number;
  taxAmount: number;
  items: TPurchaseItem[];
  totalPurchaseAmount: number;
  paidAmount: number;
  dueAmount: number;
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Partial' | 'Pending';

  notes?: string;
};

export type TPurchaseItemWithQuanity = TPurchaseItem & { quantity: number };
