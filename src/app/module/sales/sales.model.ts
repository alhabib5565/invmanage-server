import { model, Schema } from 'mongoose';
import { TSales, TSalesItem } from './sales.interface';

const salesItemSchema = new Schema<TSalesItem>(
  {
    productName: { type: String, required: true },
    code: { type: String, required: true },
    product: { type: Schema.Types.ObjectId, required: true, ref: 'Product' }, // Assuming you have a 'Product' model
    saleUnit: { type: Schema.Types.ObjectId, ref: 'Unit', required: true }, // Reference to Sale Unit
    productCost: { type: Number, required: true },
    productPrice: { type: Number, required: true },
    netUnitPrice: { type: Number, required: true },
    taxType: { type: String, enum: ['inclusive', 'exclusive'], required: true },
    productTaxRate: { type: Number, required: true, default: 0 },
    taxAmount: { type: Number, required: true, default: 0 }, //tax all of quantity
    discountAmount: { type: Number, required: true, default: 0 }, // ekta quantity te je discount
    quantity: { type: Number, required: true },
    subTotal: { type: Number, required: true },
  },
  { _id: false },
);

const salesSchema = new Schema<TSales>(
  {
    salesDate: { type: Date, required: true },
    salesId: { type: String, required: true, unique: true },
    warehouse: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Warehouse',
    }, // Assuming you have a 'Warehouse' model
    customer: { type: Schema.Types.ObjectId, required: true, ref: 'Customer' }, // Assuming you have a 'Supplier' model
    discountAmount: { type: Number, required: true, default: 0 }, // total discount Amount for the sale
    shipping: { type: Number, required: true, default: 0 },
    taxRate: { type: Number, required: true, default: 0 },
    taxAmount: { type: Number, required: true, default: 0 },
    items: { type: [salesItemSchema], required: true },
    totalSalesAmount: { type: Number, required: true },
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

export const Sales = model('Sales', salesSchema);
