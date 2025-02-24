import { Types } from 'mongoose';

export type TUnit = {
  name: string;
  slug: string;
  baseUnit: Types.ObjectId;
  conversionRatio: number;
  operator: string;
  description?: string;
};
