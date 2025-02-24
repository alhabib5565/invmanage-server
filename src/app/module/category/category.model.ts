import { model, Schema } from 'mongoose';
import { TCategory } from './category.interface';

// Category Schema
const categorySchema = new Schema<TCategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    productCount: { type: Number, default: 0 },
    description: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Category Model
export const Category = model('Category', categorySchema);
