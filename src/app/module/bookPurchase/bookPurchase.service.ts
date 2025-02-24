import httpStatus from 'http-status';
import { QueryBuilder } from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { BookPurchase } from './bookPurchase.model';
import { TBookPurchase } from './bookPurchase.interface';
import { generateBookPurchaseId } from './bookPurchase.utils';

const createBookPurchase = async (payload: TBookPurchase) => {
  payload.parchaseBookId = await generateBookPurchaseId();
  const result = await BookPurchase.create(payload);
  return result;
};

const getAllBookPurchase = async (query: Record<string, unknown>) => {
  const searchAbleFields = ['name', 'email'];
  const employeeQuery = new QueryBuilder(
    query,
    BookPurchase.find().populate('book'),
  )
    .search(searchAbleFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await employeeQuery.countTotal();
  const result = await employeeQuery.modelQuery;
  return {
    meta,
    result,
  };
};

const getSingleBookPurchase = async (_id: string) => {
  const result = await BookPurchase.findOne({ _id });
  return result;
};

const updateBookPurchase = async (
  _id: string,
  payload: Partial<TBookPurchase>,
) => {
  const bookPurchase = await BookPurchase.findOne({ _id });
  if (!bookPurchase) {
    throw new AppError(httpStatus.NOT_FOUND, 'BookPurchase not found!!');
  }

  const result = await BookPurchase.findOneAndUpdate({ _id }, payload, {
    new: true,
  });
  return result;
};

const deleteBookPurchase = async (parchaseBookId: string) => {
  const book = await BookPurchase.findOne({ parchaseBookId });
  if (!book) {
    throw new AppError(httpStatus.NOT_FOUND, 'BookPurchase not found!!');
  }

  const result = await BookPurchase.findOneAndDelete({ parchaseBookId });
  return result;
};

export const BookPurchaseService = {
  createBookPurchase,
  getAllBookPurchase,
  getSingleBookPurchase,
  updateBookPurchase,
  deleteBookPurchase,
};
