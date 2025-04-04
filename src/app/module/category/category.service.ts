import httpStatus from 'http-status';
import { QueryBuilder } from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { Category } from './category.model';
import { TCategory } from './category.interface';
import { generateSlug } from '../../utils/generateSlug';

const createCategory = async (payload: TCategory) => {
  payload.slug = generateSlug(payload.name);
  const result = await Category.create(payload);
  return result;
};

const getAllCategory = async (query: Record<string, unknown>) => {
  const searchAbleFields = ['name', 'slug', 'description'];
  const categoryQuery = new QueryBuilder(query, Category.find())
    .search(searchAbleFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await categoryQuery.countTotal();
  const result = await categoryQuery.modelQuery;
  return {
    meta,
    result,
  };
};

const getSingleCategory = async (slug: string) => {
  const result = await Category.findOne({ slug });
  return result;
};

const updateCategory = async (slug: string, payload: Partial<TCategory>) => {
  const category = await Category.findOne({ slug });
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found!!');
  }

  const result = await Category.findOneAndUpdate({ slug }, payload, {
    new: true,
  });
  return result;
};

const deleteCategory = async (slug: string) => {
  const book = await Category.findOne({ slug });
  if (!book) {
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found!!');
  }

  const result = await Category.findOneAndDelete({ slug });
  return result;
};

export const CategoryService = {
  createCategory,
  getAllCategory,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
