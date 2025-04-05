import { Types } from 'mongoose';
import { TTaxType } from '../../interface/golobal';

export type TSalesItem = {
  productName: string;
  code: string;
  product: Types.ObjectId; // product_id for product refference
  saleUnit: Types.ObjectId; // unit_id for sale unit refference
  productCost: number;
  productPrice: number;
  netUnitPrice: number;
  taxType: TTaxType;
  productTaxRate: number;
  taxAmount: number;
  discountAmount: number;
  quantity: number;
  subTotal: number;
  isDeleted?: boolean;
  AddedWhenEdit?: boolean;
};

export type TSales = {
  salesDate: Date;
  salesId: string;
  warehouse: Types.ObjectId;
  customer: Types.ObjectId;
  discountAmount: number;
  taxRate: number;
  shipping: number;
  taxAmount: number;
  items: TSalesItem[];
  totalSalesAmount: number;
  paidAmount: number;
  dueAmount: number;
  paymentMethod: 'Cash';
  paymentStatus: 'Paid' | 'Partial' | 'Pending';

  notes?: string;
};

export type TSalesItemWithQuanity = TSalesItem & { quantity: number };
