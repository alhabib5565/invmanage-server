import { model, Schema } from 'mongoose';
import { TBrand } from './brand.interface';

const brandSchema = new Schema<TBrand>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    productCount: {
      type: Number,
      default: 0,
    },
    logo: {
      type: String, // Image URL or File Path
    },
    description: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export const Brand = model('Brand', brandSchema);
