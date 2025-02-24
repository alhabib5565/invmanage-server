import { model, Schema } from 'mongoose';
import { TWarehouse } from './warehouse.interface';

const WarehouseSchema = new Schema<TWarehouse>(
  {
    name: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    slug: { type: String, unique: true, lowercase: true },
    email: { type: String },
    division: { type: String, required: true },
    district: { type: String, required: true },
    zipCode: { type: Number, required: true },
    address: { type: String, required: true },
    note: { type: String },
  },
  { timestamps: true },
);

export const Warehouse = model('Warehouse', WarehouseSchema);
