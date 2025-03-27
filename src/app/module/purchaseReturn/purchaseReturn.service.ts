/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { QueryBuilder } from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';

import { TPurchaseReturn } from './purchaseReturn.interface';
import { PurchaseReturn } from './purchaseReturn.model';
import { generatePurchaseReturnID } from './purchaseReturn.utils';
import { Purchase } from '../purchase/purchase.model';
import { Product } from '../product/product.model';
import { startSession } from 'mongoose';

const createPurchaseReturn = async (payload: TPurchaseReturn) => {
  // Check if the purchase exists
  const purchase = await Purchase.findOne({ _id: payload.purchase });
  if (!purchase) {
    throw new AppError(httpStatus.NOT_FOUND, 'Purchase not found!');
  }

  // Ensure return items are provided
  if (!payload?.returnItems || payload.returnItems.length === 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Please select products to return.',
    );
  }

  // Generate a unique return ID
  payload.returnID = await generatePurchaseReturnID();
  const session = await startSession();
  session.startTransaction();

  try {
    let totalReturnAmount = 0;

    // Iterate through the return items for validation and calculation.
    for (let i = 0; i < payload.returnItems.length; i++) {
      const returnItem = payload.returnItems[i];

      // Check if the returned product exists in the original purchase
      const purchasedItem = purchase.items.find(
        (purchaseItem) =>
          purchaseItem.product.toString() === returnItem.product.toString(),
      );

      if (!purchasedItem) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          'This product was not found in the original purchase!',
        );
      }

      // Get product details
      const product = await Product.findOne({ _id: returnItem.product })
        .populate('productUnit')
        .populate('purchaseUnit');

      if (!product) {
        throw new AppError(httpStatus.NOT_FOUND, 'Product not found!');
      }

      // Convert return quantity based on unit conversion ratio
      const { purchaseUnit, conversionRatio } = product.purchaseUnit as any;
      const returnQuantity =
        purchaseUnit === '*'
          ? returnItem.quantity * conversionRatio
          : returnItem.quantity / conversionRatio;

      // Check if the product exists in the selected warehouse
      const warehouseStock = product.stock.find(
        (stock) =>
          stock?.warehouse?.toString() === payload?.warehouse?.toString(),
      );

      if (!warehouseStock) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          'This product is not available in the selected warehouse!',
        );
      }

      // Ensure sufficient stock is available for return
      if (warehouseStock?.quantity < returnQuantity) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Not enough stock available in the warehouse for this return!',
        );
      }

      // Update product stock
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: returnItem.product, 'stock.warehouse': payload.warehouse },
        { $inc: { 'stock.$.quantity': -returnQuantity } },
        { session, new: true },
      );

      if (!updatedProduct) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Failed to update product stock!',
        );
      }

      // **Due Amount Calculation**
      let dueAmount = purchase.dueAmount - returnItem.subTotal;
      if (dueAmount < 0) {
        dueAmount = 0; // Ensure dueAmount never goes negative
      }

      // throw new AppError(BAD_GATEWAY, 'sdfsdsd');
      // Update purchase details
      await Purchase.findOneAndUpdate(
        { _id: payload.purchase, 'items.product': returnItem.product },
        {
          $inc: {
            totalPurchaseAmount: -returnItem.subTotal,
            'items.$.subTotal': -returnItem.subTotal,
            'items.$.taxAmount': -returnItem.taxAmount,
            'items.$.quantity': -returnItem.quantity,
          },
          $set: { dueAmount }, // Update due amount
        },
        { session },
      );
      totalReturnAmount += returnItem.subTotal;
    }

    payload.totalReturnAmount = totalReturnAmount;
    const result = await PurchaseReturn.create([payload], { session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();
    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getAllPurchaseReturn = async (query: Record<string, unknown>) => {
  const searchAbleFields = ['retrunID'];
  const purchaseReturnQuery = new QueryBuilder(query, PurchaseReturn.find())
    .search(searchAbleFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await purchaseReturnQuery.countTotal();
  const result = await purchaseReturnQuery.modelQuery;
  return {
    meta,
    result,
  };
};

const getSinglePurchaseReturn = async (slug: string) => {
  const result = await PurchaseReturn.findOne({ slug });
  return result;
};

const updatePurchaseReturn = async (
  slug: string,
  payload: Partial<TPurchaseReturn>,
) => {
  const purchaseReturn = await PurchaseReturn.findOne({ slug });
  if (!purchaseReturn) {
    throw new AppError(httpStatus.NOT_FOUND, 'PurchaseReturn not found!!');
  }

  const result = await PurchaseReturn.findOneAndUpdate({ slug }, payload, {
    new: true,
  });
  return result;
};

const deletePurchaseReturn = async (slug: string) => {
  const book = await PurchaseReturn.findOne({ slug });
  if (!book) {
    throw new AppError(httpStatus.NOT_FOUND, 'PurchaseReturn not found!!');
  }

  const result = await PurchaseReturn.findOneAndDelete({ slug });
  return result;
};

export const PurchaseReturnService = {
  createPurchaseReturn,
  getAllPurchaseReturn,
  getSinglePurchaseReturn,
  updatePurchaseReturn,
  deletePurchaseReturn,
};

// purchase.items = purchase.items.map((item) => {
//   if (item.product.toString() === returnItem.product.toString()) {
//     return returnItem;
//   } else {
//     return item;
//   }
// });
