/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { QueryBuilder } from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';

import { TSaleReturn } from './salesReturn.interface';
import { Product } from '../product/product.model';
import { startSession } from 'mongoose';
import { Sales } from '../sales/sales.model';
import { SaleReturn } from './salesReturn.model';

const createSaleReturn = async (payload: TSaleReturn) => {
  // Check if the sale exists
  const sale = await Sales.findOne({ _id: payload.sale });
  if (!sale) {
    throw new AppError(httpStatus.NOT_FOUND, 'Sale not found!');
  }
  // Ensure return items are provided
  if (!payload?.returnItems || payload.returnItems.length === 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Please select products to return.',
    );
  }

  //get all return products details
  const retrunProductDetails = await Product.find({
    _id: { $in: payload.returnItems.map((item) => item.product) },
  })
    .populate('saleUnit')
    .lean();

  // Generate a unique return ID
  // payload.returnID = await generateSaleReturnID();
  const session = await startSession();
  session.startTransaction();

  try {
    let totalReturnAmount = 0;
    // ================= Loop Start ===================
    for (const returnItem of payload.returnItems) {
      const product = retrunProductDetails.find(
        (itemFromPayload) =>
          itemFromPayload._id.toString() === returnItem.product.toString(),
      );

      if (!product) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          `${returnItem.productName} is not found`,
        );
      }

      // Find the returned product exists in the original sale
      const returnItemFromSale = sale.items.find(
        (saleItem) =>
          saleItem.product.toString() === returnItem.product.toString(),
      );

      // Check if the returned product exists in the original sale
      if (!returnItemFromSale) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          'This product was not found in the original sale!',
        );
      }

      // check return item sale item theke beshi kina
      if (returnItem.quantity > returnItemFromSale.quantity) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Retrun item is greter then sale item',
        );
      }

      // Convert return quantity based on unit conversion ratio
      const { operator, conversionRatio } = product.saleUnit as any;
      const returnQuantity =
        operator === '*'
          ? returnItem.quantity * conversionRatio
          : returnItem.quantity / conversionRatio;
      // Check if the product exists in the selected warehouse
      const warehouseStock = product.stock.find(
        (stock) => stock?.warehouse?.toString() === sale?.warehouse?.toString(),
      );

      if (!warehouseStock) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          'This product is not available in the selected warehouse!',
        );
      }

      // Update product stock
      // const updatedProduct = await Product.findOneAndUpdate(
      //   { _id: returnItem.product, 'stock.warehouse': payload.warehouse },
      //   { $inc: { 'stock.$.quantity': returnQuantity } },
      //   { session, new: true },
      // );

      // if (!updatedProduct) {
      //   throw new AppError(
      //     httpStatus.BAD_REQUEST,
      //     'Failed to update product stock!',
      //   );
      // }

      const { subTotal, netUnitPrice } = returnItemFromSale;
      // **Due Amount Calculation**
      // 500 - 1000
      let dueAmount = sale.dueAmount - returnItemFromSale.subTotal;
      console.log({
        returnItemFromSale,
        dueAmount,
        'sale.dueAmount': sale.dueAmount,
        'returnItemFromSale.subTotal':
          subTotal - returnItem.quantity * netUnitPrice,
      });
      // note: dueAmount negetive hole payment record e ekta payment entry korte hobe je isRetrun: true hobe
      if (dueAmount < 0) {
        dueAmount = 0; // Ensure dueAmount never goes negative
      }

      // Update sale details
      // await Sales.findOneAndUpdate(
      //   { _id: payload.sale, 'items.product': returnItem.product },
      //   {
      //     $inc: {
      //       totalSaleAmount: -subTotal,
      //       'items.$.subTotal': -subTotal,
      //       'items.$.taxAmount': -taxAmount,
      //       'items.$.quantity': -returnItem.quantity,
      //     },
      //     $set: { dueAmount }, // Update due amount
      //   },
      //   { session },
      // );
      totalReturnAmount += returnItemFromSale.subTotal;
    }
    // ================= Loop End ========================
    payload.totalReturnAmount = totalReturnAmount;
    const result = await SaleReturn.create([payload], { session });

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

const getAllSaleReturn = async (query: Record<string, unknown>) => {
  const searchAbleFields = ['retrunID', 'notes'];
  const saleReturnQuery = new QueryBuilder(query, SaleReturn.find())
    .search(searchAbleFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await saleReturnQuery.countTotal();
  const result = await saleReturnQuery.modelQuery;
  return {
    meta,
    result,
  };
};

const getSingleSaleReturn = async (slug: string) => {
  const result = await SaleReturn.findOne({ slug });
  return result;
};

const updateSaleReturn = async (
  slug: string,
  payload: Partial<TSaleReturn>,
) => {
  const saleReturn = await SaleReturn.findOne({ slug });
  if (!saleReturn) {
    throw new AppError(httpStatus.NOT_FOUND, 'SaleReturn not found!!');
  }

  const result = await SaleReturn.findOneAndUpdate({ slug }, payload, {
    new: true,
  });
  return result;
};

const deleteSaleReturn = async (slug: string) => {
  const book = await SaleReturn.findOne({ slug });
  if (!book) {
    throw new AppError(httpStatus.NOT_FOUND, 'SaleReturn not found!!');
  }

  const result = await SaleReturn.findOneAndDelete({ slug });
  return result;
};

export const SaleReturnService = {
  createSaleReturn,
  getAllSaleReturn,
  getSingleSaleReturn,
  updateSaleReturn,
  deleteSaleReturn,
};
