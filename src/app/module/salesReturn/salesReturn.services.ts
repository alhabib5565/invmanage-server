/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { QueryBuilder } from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';

import { TSaleReturn } from './salesReturn.interface';
import { Product } from '../product/product.model';
import { startSession } from 'mongoose';
import { Sales } from '../sales/sales.model';
import { SaleReturn } from './salesReturn.model';
import { TPaymentRecord } from '../paymentRecord/paymentRecord.interface';
import { generatePaymentRecordId } from '../paymentRecord/paymentRecord.utils';
import { PaymentRecord } from '../paymentRecord/paymentRecord.model';
import { Customer } from '../customer/customer.model';
import { generateSaleReturnID } from './salesRetrun.utils';

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
  const returnProductDetails = await Product.find({
    _id: { $in: payload.returnItems.map((item) => item.product) },
  })
    .populate('saleUnit')
    .lean();

  const modifiedReturnItems = [];

  const bulkProductsUpdates = [];
  const bulkSalesUpdates = [];

  const session = await startSession();
  session.startTransaction();

  try {
    let totalReturnAmount = 0;
    // ================= Loop Start ===================
    for (const returnItem of payload.returnItems) {
      const product = returnProductDetails.find(
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
          'Return item is greater than sale item',
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
        (stock) =>
          stock?.warehouse?.toString() === payload?.warehouse?.toString(),
      );

      if (!warehouseStock) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          'This product is not available in the selected warehouse!',
        );
      }

      bulkProductsUpdates.push({
        updateOne: {
          filter: {
            _id: returnItem.product,
            'stock.warehouse': payload.warehouse,
          },
          update: { $inc: { 'stock.$.quantity': returnQuantity } },
        },
      });

      const { netUnitPrice, taxAmount, quantity } = returnItemFromSale;

      // ** Amount Calculation**
      const retrunTaxAmount =
        Number((taxAmount / quantity).toFixed(2)) * returnItem.quantity;
      const returnSubTotal =
        retrunTaxAmount + returnItem.quantity * netUnitPrice;
      let dueAmount = sale.dueAmount - returnSubTotal;

      modifiedReturnItems.push({
        ...returnItem,
        retrunSubTotal: returnSubTotal,
      });

      if (dueAmount < 0) {
        dueAmount = 0; // Ensure dueAmount never goes negative
      }

      // Update sale details
      bulkSalesUpdates.push({
        updateOne: {
          filter: { _id: payload.sale, 'items.product': returnItem.product },
          update: {
            $inc: {
              totalSalesAmount: -returnSubTotal,
              'items.$.subTotal': -returnSubTotal,
              'items.$.taxAmount': -retrunTaxAmount,
              'items.$.quantity': -returnItem.quantity,
            },
            $set: { dueAmount },
          },
        },
      });
      totalReturnAmount += returnSubTotal;
    }
    // ================= Loop End ========================
    payload.returnItems = modifiedReturnItems;
    payload.totalReturnAmount = totalReturnAmount;

    await Product.bulkWrite(bulkProductsUpdates, { session });
    await Sales.bulkWrite(bulkSalesUpdates, { session });
    // Generate a unique return ID
    payload.returnID = await generateSaleReturnID();
    // Step 1: create sale retrun
    const result = await SaleReturn.create([payload], { session });

    // Step 2: Payment  (Jodi Due amount theke retrun amount beshi hoi tahole customer ke tk return dite hobe)
    if (totalReturnAmount > sale.dueAmount) {
      const paymentsData: Partial<TPaymentRecord> = {
        customer: sale.customer,
        sale: payload.sale,
        paymentId: await generatePaymentRecordId(),
        amount: totalReturnAmount - sale.dueAmount,
      };
      await PaymentRecord.create([paymentsData], { session });
    }

    // total due calculation
    const customer = await Customer.findOne({ _id: sale.customer });
    if (!customer) {
      throw new AppError(httpStatus.NOT_FOUND, 'Customer not found');
    }
    let totalDue;
    if (customer.totalDue < totalReturnAmount) {
      totalDue = 0;
    } else {
      totalDue = customer.totalDue - totalReturnAmount;
    }
    // Step 3:
    await Customer.findOneAndUpdate(
      { _id: sale.customer },
      {
        $inc: {
          totalPurchased: -totalReturnAmount,
        },
        $set: {
          totalDue,
        },
      },
      { session },
    );
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
