import { model, Schema } from 'mongoose';
import { TBaseUnit } from './baseUnit.interface';

const BaseUnitSchema = new Schema<TBaseUnit>(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String },
  },
  { timestamps: true },
);

export const BaseUnit = model('BaseUnit', BaseUnitSchema);
