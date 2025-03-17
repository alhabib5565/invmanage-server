import { model, Schema } from 'mongoose';
import { TPurchase, TPurchaseItem } from './purchase.interface';

const purchaseItemSchema = new Schema<TPurchaseItem>(
  {
    productName: { type: String, required: true },
    code: { type: String, required: true },
    product: { type: Schema.Types.ObjectId, required: true, ref: 'Product' }, // Assuming you have a 'Product' model
    productCost: { type: Number, required: true },
    productPrice: { type: Number, required: true },
    netUnitPrice: { type: Number, required: true },
    taxType: { type: String, enum: ['inclusive', 'exclusive'], required: true },
    productTaxRate: { type: Number, required: true, default: 0 },
    taxAmount: { type: Number, required: true, default: 0 },
    discountAmount: { type: Number, required: true, default: 0 },
    quantity: { type: Number, required: true },
    subTotal: { type: Number, required: true },
  },
  { _id: false },
);

const purchaseSchema = new Schema<TPurchase>(
  {
    purchaseDate: { type: Date, required: true },
    purchaseId: { type: String, required: true, unique: true },
    warehouse: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Warehouse',
    }, // Assuming you have a 'Warehouse' model
    supplier: { type: Schema.Types.ObjectId, required: true, ref: 'Supplier' }, // Assuming you have a 'Supplier' model
    discountAmount: { type: Number, required: true, default: 0 },
    shipping: { type: Number, required: true, default: 0 },
    taxRate: { type: Number, required: true, default: 0 },
    taxAmount: { type: Number, required: true, default: 0 },
    items: { type: [purchaseItemSchema], required: true },
    totalPurchaseAmount: { type: Number, required: true },
    paidAmount: { type: Number, required: true },
    dueAmount: { type: Number, required: true },
    paymentMethod: { type: String, required: true, default: 'Cash' },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Partial', 'Pending'],
      required: true,
    },
    notes: { type: String },
  },
  { timestamps: true },
);

export const Purchase = model('Purchase', purchaseSchema);
