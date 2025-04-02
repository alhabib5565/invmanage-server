import { Types } from 'mongoose';
export type TImage = {
  secure_url: string;
  public_id: string;
};

export type TStock = {
  warehouse: Types.ObjectId;
  quantity: number;
};
export type TProduct = {
  productName: string;
  slug: string;
  productID: string;
  code: string;
  brand: Types.ObjectId;
  category: Types.ObjectId;
  productUnit: Types.ObjectId;
  purchaseUnit: Types.ObjectId;
  saleUnit: Types.ObjectId;
  productCost: number;
  productPrice: number;
  discountAmount: number;
  taxType: 'inclusive' | 'exclusive';
  productTaxRate?: number;
  stockAlert: number;
  stock: TStock[];
  images?: TImage[];
  is_active: boolean;
  description: string;
};
