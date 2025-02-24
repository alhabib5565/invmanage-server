import { Types } from 'mongoose';

export type TProduct = {
  name: string;
  slug: string;
  productID: string;
  stock_alert: number;
  brand: Types.ObjectId;
  category: Types.ObjectId;
  tax?: number;
  image?: string;
  is_active: boolean;
};
