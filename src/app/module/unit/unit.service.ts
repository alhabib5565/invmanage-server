import httpStatus from 'http-status';
import { QueryBuilder } from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';

import { generateSlug } from '../../utils/generateSlug';
import { TUnit } from './unit.interface';
import { Unit } from './unit.model';
import { BaseUnit } from '../baseUnit/baseUnit.model';

const createUnit = async (payload: TUnit) => {
  const baseUnit = await BaseUnit.findOne({ _id: payload.baseUnit });
  if (!baseUnit) {
    throw new AppError(httpStatus.NOT_FOUND, 'Base Unit not found!!');
  }

  payload.slug = generateSlug(payload.name);
  const result = await Unit.create(payload);
  return result;
};

const getAllUnit = async (query: Record<string, unknown>) => {
  const searchAbleFields = ['name', 'slug', 'description'];
  const unitQuery = new QueryBuilder(query, Unit.find().populate('baseUnit'))
    .search(searchAbleFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await unitQuery.countTotal();
  const result = await unitQuery.modelQuery;
  return {
    meta,
    result,
  };
};

const getSingleUnit = async (slug: string) => {
  const result = await Unit.findOne({ slug }).populate('baseUnit');
  return result;
};

const updateUnit = async (slug: string, payload: Partial<TUnit>) => {
  const unit = await Unit.findOne({ slug });
  if (!unit) {
    throw new AppError(httpStatus.NOT_FOUND, 'Unit not found!!');
  }

  const result = await Unit.findOneAndUpdate({ slug }, payload, {
    new: true,
  });
  return result;
};

const deleteUnit = async (slug: string) => {
  const book = await Unit.findOne({ slug });
  if (!book) {
    throw new AppError(httpStatus.NOT_FOUND, 'Unit not found!!');
  }

  const result = await Unit.findOneAndDelete({ slug });
  return result;
};

export const UnitService = {
  createUnit,
  getAllUnit,
  getSingleUnit,
  updateUnit,
  deleteUnit,
};
