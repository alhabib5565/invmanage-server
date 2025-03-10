import httpStatus from 'http-status';
import { QueryBuilder } from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { Purchase } from './purchase.model';
import { TPurchase } from './purchase.interface';
import { generatePurchaseId } from './purchase.utils';
import { startSession } from 'mongoose';
import { Product } from '../product/product.model';

const createPurchase = async (payload: TPurchase) => {
  const session = await startSession();
  session.startTransaction();

  if (payload.items.length < 1) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Please select product. then try again!!',
    );
  }

  try {
    for (const item of payload.items) {
      // const product = await Product.findOne({ _id: item.product }).lean();
      // if (!product) {
      //   throw new AppError(httpStatus.NOT_FOUND, `${item.name} is not found`);
      // }

      await Product.findByIdAndUpdate(
        { _id: item.product },
        { $inc: { stock: item.quantity } },
        { session },
      );
    }

    payload.purchaseId = await generatePurchaseId();
    const result = await Purchase.create([payload], { session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getAllPurchase = async (query: Record<string, unknown>) => {
  const searchAbleFields = ['name', 'email'];
  const purchaseQuery = new QueryBuilder(
    query,
    Purchase.find().populate('book'),
  )
    .search(searchAbleFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await purchaseQuery.countTotal();
  const result = await purchaseQuery.modelQuery;
  return {
    meta,
    result,
  };
};

const getSinglePurchase = async (_id: string) => {
  const result = await Purchase.findOne({ _id });
  return result;
};

const updatePurchase = async (_id: string, payload: Partial<TPurchase>) => {
  const purchase = await Purchase.findOne({ _id });
  if (!purchase) {
    throw new AppError(httpStatus.NOT_FOUND, 'Purchase not found!!');
  }

  const result = await Purchase.findOneAndUpdate({ _id }, payload, {
    new: true,
  });
  return result;
};

const deletePurchase = async (parchaseId: string) => {
  const book = await Purchase.findOne({ parchaseId });
  if (!book) {
    throw new AppError(httpStatus.NOT_FOUND, 'Purchase not found!!');
  }

  const result = await Purchase.findOneAndDelete({ parchaseId });
  return result;
};

export const PurchaseService = {
  createPurchase,
  getAllPurchase,
  getSinglePurchase,
  updatePurchase,
  deletePurchase,
};
