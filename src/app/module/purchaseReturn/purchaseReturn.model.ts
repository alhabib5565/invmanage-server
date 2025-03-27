import { model, Schema } from 'mongoose';
import {
  TPurchaseReturn,
  TPurchaseReturnItem,
} from './purchaseReturn.interface';

const returnItemSchema = new Schema<TPurchaseReturnItem>(
  {
    productName: { type: String, required: true },
    code: { type: String, required: true },
    product: { type: Schema.Types.ObjectId, required: true, ref: 'Product' }, // Assuming you have a 'Product' model
    productCost: { type: Number, required: true },
    productPrice: { type: Number, required: true },
    netUnitPrice: { type: Number, required: true },
    taxType: { type: String, enum: ['inclusive', 'exclusive'], required: true },
    productTaxRate: { type: Number, required: true, default: 0 },
    taxAmount: { type: Number, required: true, default: 0 }, //tax all of quantity
    discountAmount: { type: Number, required: true, default: 0 }, //  discount per quantity
    quantity: { type: Number, required: true },
    subTotal: { type: Number, required: true },
  },
  { _id: false },
);

const purchaseReturnSchema = new Schema<TPurchaseReturn>({
  returnID: { type: String, required: true, unique: true },
  purchase: { type: Schema.Types.ObjectId, ref: 'Purchase', required: true }, // jei purchase theke return kora hocche
  warehouse: { type: Schema.Types.ObjectId, ref: 'Warehouse', required: true },
  supplier: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
  returnDate: { type: Date, required: true },
  returnItems: { type: [returnItemSchema], required: true },
  totalReturnAmount: { type: Number, required: true },
  notes: { type: String },
});

export const PurchaseReturn = model<TPurchaseReturn>(
  'PurchaseReturn',
  purchaseReturnSchema,
);
