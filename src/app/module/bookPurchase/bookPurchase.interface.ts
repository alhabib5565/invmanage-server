import { Types } from 'mongoose';

export type TBookPurchase = {
  parchaseBookId: string;
  book: Types.ObjectId;
  author?: string;
  publisher?: string;
  quantityPurchased: number;
  purchasePricePerUnit: number;
  // totalPurchaseCost: number;
  supplierName?: string;
  purchaseDate: Date;
  notes?: string;
};
