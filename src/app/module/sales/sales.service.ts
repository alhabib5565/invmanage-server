/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { QueryBuilder } from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';

import { startSession } from 'mongoose';
import { Product } from '../product/product.model';
import { Warehouse } from '../warehouse/warehouse.model';
import { TSales } from './sales.interface';
import { calculateProductTotals } from '../../utils/common.utils';
import { generateSalesId } from './sales.utils';
import { Sales } from './sales.model';
import { generatePaymentRecordId } from '../paymentRecord/paymentRecord.utils';
import { TPaymentRecord } from '../paymentRecord/paymentRecord.interface';
import { PaymentRecord } from '../paymentRecord/paymentRecord.model';
import { Customer } from '../customer/customer.model';

const createSales = async (payload: TSales) => {
  if (payload.items.length < 1) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Please select product. then try again!!',
    );
  }

  const warehouse = await Warehouse.findOne({ _id: payload.warehouse }).lean();
  //check warehouse exist
  if (!warehouse) {
    throw new AppError(httpStatus.NOT_FOUND, 'This warehouse is not found');
  }

  const customer = await Customer.findOne({ _id: payload.customer }).lean();
  //check customer exist
  if (!customer) {
    throw new AppError(httpStatus.NOT_FOUND, 'This customer is not found');
  }

  const salesProductItems = await Product.find({
    _id: { $in: payload.items.map((item) => item.product) },
  })
    // .populate('productUnit')
    .populate('saleUnit');
  const session = await startSession();
  session.startTransaction();

  const bulkSalesProduct = [];
  try {
    //Start Loop=======================
    for (const item of payload.items) {
      // const product = await Product.findOne({ _id: item.product })
      //   // .populate('productUnit')
      //   .populate('saleUnit');

      const product = salesProductItems.find(
        (itemFromPayload) =>
          itemFromPayload._id.toString() === item.product.toString(),
      );

      if (!product) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          `${item.productName} is not found`,
        );
      }
      const { productTaxRate, productPrice, discountAmount, taxType } = product;
      const { taxAmount, subTotal, netUnitPrice } = calculateProductTotals({
        quantity: item.quantity,
        taxType,
        productPrice,
        productTaxRate,
        discountAmount,
      });

      // console.log({ taxAmount, subTotal, netUnitPrice });
      const saleUnitOperator = (product.saleUnit as any).operator;
      const conversionRatio = (product.saleUnit as any).conversionRatio;

      let baseQuantity = 0;

      if (saleUnitOperator === '*') {
        baseQuantity = item.quantity * conversionRatio;
      } else if (saleUnitOperator === '/') {
        baseQuantity = item.quantity / conversionRatio;
      }

      //find warehouse form product stock
      const warehouseStock = product.stock.find(
        (stock) =>
          stock?.warehouse?.toString() === payload?.warehouse?.toString(),
      );

      if (!warehouseStock) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Product "${product.productName}" not purchased. Cannot proceed with the sale.`,
        );
      }

      if (warehouseStock && warehouseStock?.quantity < baseQuantity) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Sale quantity for "${product.productName}" is greater than available stock`,
        );
      }

      payload.items = payload.items.map((payloadProductItem) =>
        payloadProductItem.product.toString() === item.product.toString()
          ? {
              quantity: payloadProductItem.quantity,
              product: payloadProductItem.product,
              ...product,
              subTotal,
              taxAmount,
              netUnitPrice,
              productTaxRate: product.productTaxRate || 0,
            }
          : payloadProductItem,
      );

      // await Product.findOneAndUpdate(
      //   { _id: item.product, 'stock.warehouse': payload.warehouse },
      //   { $inc: { 'stock.$.quantity': -baseQuantity } },
      //   { session },
      // );

      // **Bulk Update Operation**
      bulkSalesProduct.push({
        updateOne: {
          filter: { _id: item.product, 'stock.warehouse': payload.warehouse },
          update: { $inc: { 'stock.$.quantity': -baseQuantity } },
        },
      });
    }
    //end Loop=========================
    // Execute bulk write
    if (bulkSalesProduct.length > 0) {
      await Product.bulkWrite(bulkSalesProduct, { session });
    }
    const sumOfAllSubTotal = payload.items.reduce((prev, current) => {
      return (prev += current.subTotal);
    }, 0);

    if (sumOfAllSubTotal < payload.discountAmount) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'Discount cannot exceed subtotal',
      );
    }
    const totalTax =
      (sumOfAllSubTotal - payload?.discountAmount) * (payload.taxRate / 100);

    const grandTotal =
      sumOfAllSubTotal + totalTax + payload.shipping - payload?.discountAmount;

    payload.totalSalesAmount = grandTotal;
    payload.dueAmount = grandTotal - payload.paidAmount;
    payload.taxAmount = totalTax;
    payload.salesId = await generateSalesId();

    // Step 1: Create Sales
    const saleData = await Sales.create([payload], { session });

    // Step 2: Payment Collect (Jodi kono payment thake)
    if (payload.paidAmount > 0) {
      const paymentsData: Partial<TPaymentRecord> = {
        customer: payload.customer,
        sale: saleData[0]._id,
        paymentId: await generatePaymentRecordId(),
        amountCollected: payload.paidAmount,
      };

      await PaymentRecord.create([paymentsData], { session });
    }

    // Step 3: Customer Update
    await Customer.findOneAndUpdate(
      { _id: payload.customer },
      {
        $inc: {
          totalPurchased: payload.totalSalesAmount,
          totalPaid: payload.paidAmount,
          totalDue: payload.dueAmount,
        },
      },
      { session },
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return saleData;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getAllSales = async (query: Record<string, unknown>) => {
  const searchAbleFields = ['name', 'salesId'];
  const purchaseQuery = new QueryBuilder(query, Sales.find())
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

const getSingleSales = async (purchaseId: string) => {
  const result = await Sales.findOne({ purchaseId }).populate({
    path: 'items.product',
    populate: {
      path: 'productUnit',
      model: 'BaseUnit',
    },
  });
  return result;
};

const updateSales = async (salesId: string, payload: TSales) => {
  console.log(salesId, payload);
};

const deleteSales = async (salesId: string) => {
  const sales = await Sales.findOne({ salesId });
  if (!sales) {
    throw new AppError(httpStatus.NOT_FOUND, 'Sales not found!!');
  }

  const result = await Sales.findOneAndDelete({ salesId });
  return result;
};

export const SalesService = {
  createSales,
  getAllSales,
  getSingleSales,
  updateSales,
  deleteSales,
};
