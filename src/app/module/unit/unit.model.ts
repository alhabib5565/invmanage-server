import { model, Schema } from 'mongoose';
import { TUnit } from './unit.interface';

const UnitSchema = new Schema<TUnit>(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, lowercase: true },
    baseUnit: { type: Schema.Types.ObjectId, ref: 'BaseUnit', required: true },
    conversionRatio: { type: Number, required: true },
    operator: { type: String, enum: ['*', '/'], required: true },
    description: { type: String },
  },
  { timestamps: true },
);

export const Unit = model('Unit', UnitSchema);
