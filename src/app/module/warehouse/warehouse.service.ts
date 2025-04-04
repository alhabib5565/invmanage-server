import httpStatus from 'http-status';
import { QueryBuilder } from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { Warehouse } from './warehouse.model';
import { TWarehouse } from './warehouse.interface';
import { generateSlug } from '../../utils/generateSlug';

const createWarehouse = async (payload: TWarehouse) => {
  payload.slug = generateSlug(payload.name);
  const result = await Warehouse.create(payload);
  return result;
};

const getAllWarehouse = async (query: Record<string, unknown>) => {
  const searchAbleFields = [
    'name',
    'slug',
    'email',
    'division',
    'address',
    'zipCode',
    'district',
    'mobileNumber',
    'notes',
  ];
  const warehouseQuery = new QueryBuilder(query, Warehouse.find())
    .search(searchAbleFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await warehouseQuery.countTotal();
  const result = await warehouseQuery.modelQuery;
  return {
    meta,
    result,
  };
};

const getSingleWarehouse = async (slug: string) => {
  const result = await Warehouse.findOne({ slug });
  return result;
};

const updateWarehouse = async (slug: string, payload: Partial<TWarehouse>) => {
  const warehouse = await Warehouse.findOne({ slug });
  if (!warehouse) {
    throw new AppError(httpStatus.NOT_FOUND, 'Warehouse not found!!');
  }

  const result = await Warehouse.findOneAndUpdate({ slug }, payload, {
    new: true,
  });
  return result;
};

const deleteWarehouse = async (slug: string) => {
  const book = await Warehouse.findOne({ slug });
  if (!book) {
    throw new AppError(httpStatus.NOT_FOUND, 'Warehouse not found!!');
  }

  const result = await Warehouse.findOneAndDelete({ slug });
  return result;
};

export const WarehouseService = {
  createWarehouse,
  getAllWarehouse,
  getSingleWarehouse,
  updateWarehouse,
  deleteWarehouse,
};
