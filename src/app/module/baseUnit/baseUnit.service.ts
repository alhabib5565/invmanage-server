import httpStatus from 'http-status';
import { QueryBuilder } from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';

import { generateSlug } from '../../utils/generateSlug';
import { TBaseUnit } from './baseUnit.interface';
import { BaseUnit } from './baseUnit.model';

const createBaseUnit = async (payload: TBaseUnit) => {
  payload.slug = generateSlug(payload.name);
  const result = await BaseUnit.create(payload);
  return result;
};

const getAllBaseUnit = async (query: Record<string, unknown>) => {
  const searchAbleFields = ['name', 'slug', 'description'];
  const baseUnitQuery = new QueryBuilder(query, BaseUnit.find())
    .search(searchAbleFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await baseUnitQuery.countTotal();
  const result = await baseUnitQuery.modelQuery;
  return {
    meta,
    result,
  };
};

const getSingleBaseUnit = async (slug: string) => {
  const result = await BaseUnit.findOne({ slug });
  return result;
};

const updateBaseUnit = async (slug: string, payload: Partial<TBaseUnit>) => {
  const baseUnit = await BaseUnit.findOne({ slug });
  if (!baseUnit) {
    throw new AppError(httpStatus.NOT_FOUND, 'BaseUnit not found!!');
  }

  const result = await BaseUnit.findOneAndUpdate({ slug }, payload, {
    new: true,
  });
  return result;
};

const deleteBaseUnit = async (slug: string) => {
  const book = await BaseUnit.findOne({ slug });
  if (!book) {
    throw new AppError(httpStatus.NOT_FOUND, 'BaseUnit not found!!');
  }

  const result = await BaseUnit.findOneAndDelete({ slug });
  return result;
};

export const BaseUnitService = {
  createBaseUnit,
  getAllBaseUnit,
  getSingleBaseUnit,
  updateBaseUnit,
  deleteBaseUnit,
};
