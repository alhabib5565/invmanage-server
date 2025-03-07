import { Types } from 'mongoose';
export type TImage = {
  secure_url: string;
  public_id: string;
};
export type TProduct = {
  productName: string;
  slug: string;
  productID: string;
  brand: Types.ObjectId;
  category: Types.ObjectId;
  productUnit: Types.ObjectId;
  purchaseUnit: Types.ObjectId;
  saleUnit: Types.ObjectId;
  productCost: number;
  productPrice: number;
  taxType: 'inclusive' | 'exclusive';
  tax?: number;
  stockAlert: number;
  images?: TImage[];
  is_active: boolean;
  description: string;
};
