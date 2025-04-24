import { model, Schema } from 'mongoose';
import { TSaleReturn, TSaleReturnItem } from './salesReturn.interface';

const SaleRetrunItemSchema = new Schema<TSaleReturnItem>({
  product: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
  quantity: { type: Number, required: true },
  retrunSubTotal: { type: Number, required: true },
});

const SaleRetrunSchema = new Schema<TSaleReturn>(
  {
    returnID: { type: String, required: true, unique: true },
    sale: { type: Schema.Types.ObjectId, ref: 'Sale', required: true },
    warehouse: {
      type: Schema.Types.ObjectId,
      ref: 'Warehouse',
      required: true,
    },
    supplier: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
    returnDate: { type: Date, required: true },
    returnItems: { type: [SaleRetrunItemSchema], required: true },
    totalReturnAmount: { type: Number, required: true },
    notes: { type: String },
  },
  { timestamps: true },
);

export const SaleReturn = model('SaleReturn', SaleRetrunSchema);
