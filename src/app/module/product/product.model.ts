import { Schema, model } from 'mongoose';
import { TProduct } from './product.interface';

const ProductSchema = new Schema<TProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true }, // For SEO-friendly URLs
    productID: { type: String, required: true, unique: true }, // Unique product productID
    stock_alert: { type: Number, default: 10 }, // Minimum stock alert
    brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true }, // Reference to Brand
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true }, // Reference to Category
    tax: { type: Number, default: 0 }, // Tax percentage (if applicable)
    image: { type: String }, // Product image URL
    is_active: { type: Boolean, default: true }, // Is the product active?
  },
  { timestamps: true },
);

export const Product = model('Product', ProductSchema);
