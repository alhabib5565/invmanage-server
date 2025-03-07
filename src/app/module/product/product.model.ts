import { Schema, model } from 'mongoose';
import { TImage, TProduct } from './product.interface';

const imageSchema: Schema = new Schema<TImage>(
  {
    secure_url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
  { _id: false },
);

const ProductSchema = new Schema<TProduct>(
  {
    productName: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true }, // For SEO-friendly URLs
    productID: { type: String, required: true, unique: true }, // Unique product productID
    stockAlert: { type: Number, default: 10, alias: 'stock_alert' }, // Minimum stock alert, alias for backward compatibility.
    brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true }, // Reference to Brand
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true }, // Reference to Category
    tax: { type: Number, default: 0 }, // Tax percentage (if applicable)
    productUnit: {
      type: Schema.Types.ObjectId,
      ref: 'BaseUnit',
      required: true,
    }, // Reference to Product Unit
    purchaseUnit: { type: Schema.Types.ObjectId, ref: 'Unit', required: true }, // Reference to Purchase Unit
    saleUnit: { type: Schema.Types.ObjectId, ref: 'Unit', required: true }, // Reference to Sale Unit
    productCost: { type: Number, required: true },
    productPrice: { type: Number, required: true },
    taxType: {
      type: String,
      enum: ['inclusive', 'exclusive'],
      required: true,
    },
    images: {
      type: [imageSchema],
    },
    is_active: { type: Boolean, default: true }, // Is the product active?
    description: { type: String, default: '' }, // Product description
  },
  { timestamps: true },
);

export const Product = model('Product', ProductSchema);
