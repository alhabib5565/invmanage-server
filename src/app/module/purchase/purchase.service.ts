/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { QueryBuilder } from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { Purchase } from './purchase.model';
import { TPurchase } from './purchase.interface';
import { calculateProductTotals, generatePurchaseId } from './purchase.utils';
import { startSession } from 'mongoose';
import { Product } from '../product/product.model';
import { Warehouse } from '../warehouse/warehouse.model';

const createPurchase = async (payload: TPurchase) => {
  const session = await startSession();
  session.startTransaction();

  if (payload.items.length < 1) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Please select product. then try again!!',
    );
  }

  const warehouse = await Warehouse.findOne({ _id: payload.warehouse }).lean();
  if (!warehouse) {
    throw new AppError(httpStatus.NOT_FOUND, 'This warehouse is not found');
  }

  const sumOfAllSubTotal = payload.items.reduce((prev, current) => {
    const { subTotal } = calculateProductTotals(current);
    return (prev += subTotal);
  }, 0);

  const totalTax =
    (sumOfAllSubTotal - payload?.discountAmount) * (payload.taxRate / 100);

  const grandTotal =
    sumOfAllSubTotal + totalTax + payload.shipping - payload?.discountAmount;
  //

  console.log({ sumOfAllSubTotal, totalTax, grandTotal });

  payload.totalPurchaseAmount = grandTotal;
  payload.dueAmount = grandTotal - payload.paidAmount;
  payload.taxAmount = totalTax;

  try {
    for (const item of payload.items) {
      //@ts-ignore
      const product = await Product.findOne({ _id: item._id })
        .populate('productUnit')
        .populate('purchaseUnit');
      if (!product) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          `${item.productName} is not found`,
        );
      }

      item.productTaxRate = product.productTaxRate || 0;

      const { taxAmount, subTotal, netUnitPrice } =
        calculateProductTotals(item);
      console.log({ taxAmount, subTotal, netUnitPrice });
      const purchaseUnit = (product.purchaseUnit as any).operator;
      const conversionRatio = (product.purchaseUnit as any).conversionRatio;

      let baseQuantity;

      if (purchaseUnit === '*') {
        baseQuantity = item.quantity * conversionRatio;
      } else if (purchaseUnit === '/') {
        baseQuantity = item.quantity / conversionRatio;
      }

      const warehouseStock = product.stock.find(
        (stock) =>
          stock?.warehouse?.toString() === payload?.warehouse?.toString(),
      );
      console.log({ warehouseStock });
      payload.items = payload.items.map((payloadProductItem) =>
        //@ts-ignore
        payloadProductItem._id.toString() === item._id.toString()
          ? {
              ...payloadProductItem,
              //@ts-ignore
              product: payloadProductItem._id,
              subTotal,
              taxAmount,
              netUnitPrice,
              productTaxRate: product.productTaxRate || 0,
            }
          : payloadProductItem,
      );

      if (warehouseStock) {
        await Product.findOneAndUpdate(
          //@ts-ignore
          { _id: item._id, 'stock.warehouse': payload.warehouse },
          { $inc: { 'stock.$.quantity': baseQuantity } },
          { session },
        );
      } else {
        await Product.findByIdAndUpdate(
          //@ts-ignore
          { _id: item._id },
          {
            $push: {
              stock: { warehouse: payload.warehouse, quantity: baseQuantity },
            },
          },
          { session },
        );
      }
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
  const searchAbleFields = ['name', 'purchaseId'];
  const purchaseQuery = new QueryBuilder(query, Purchase.find())
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

const getSinglePurchase = async (purchaseId: string) => {
  const result = await Purchase.findOne({ purchaseId }).populate({
    path: 'items.product',
    populate: {
      path: 'productUnit',
      model: 'BaseUnit',
    },
  });
  return result;
};

const updatePurchase = async (purchaseId: string, payload: TPurchase) => {
  const session = await startSession();
  session.startTransaction();

  // Check if purchase exists
  const purchase = await Purchase.findOne({ purchaseId });
  if (!purchase) {
    throw new AppError(httpStatus.NOT_FOUND, 'Purchase not found!!');
  }

  // Check if products exist
  if (!payload?.items || payload.items.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Please select products.');
  }

  // Clone previous payload items
  const previousItems = payload.items.map((item) => ({ ...item }));

  // Remove deleted items & update purchase
  const newItems = payload.items.filter((item) => !item.isDeleted);
  purchase.items = newItems;

  //  Recalculate Totals
  const sumOfAllSubTotal = payload.items.reduce((prev, current) => {
    const { subTotal } = calculateProductTotals(current);
    return (prev += subTotal);
  }, 0);
  console.log({ sumOfAllSubTotal });
  const totalTax =
    (sumOfAllSubTotal - payload?.discountAmount) * (payload.taxRate / 100);

  const grandTotal =
    sumOfAllSubTotal + totalTax + payload.shipping - payload.discountAmount;
  console.log({
    grandTotal,
    totalTax,
    shipping: payload.shipping,
    discount: payload.discountAmount,
  });
  payload.totalPurchaseAmount = grandTotal;
  payload.dueAmount = grandTotal - payload.paidAmount;
  payload.taxAmount = totalTax;

  try {
    for (const item of previousItems) {
      //@ts-ignore
      const product = await Product.findOne({ _id: item.product })
        .populate('productUnit')
        .populate('purchaseUnit');
      if (!product) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          `${item.productName} is not found`,
        );
      }

      const { purchaseUnit, conversionRatio } = product.purchaseUnit as any;
      const updatedItemQuantity =
        purchaseUnit === '*'
          ? item.quantity * conversionRatio
          : item.quantity / conversionRatio;

      const oldWarehouseStock = product.stock.find(
        (stock) =>
          stock?.warehouse?.toString() === payload?.warehouse?.toString(),
      );

      // Recalculate item values
      item.productTaxRate = product.productTaxRate || 0;
      const { taxAmount, subTotal, netUnitPrice } =
        calculateProductTotals(item);

      // Update payload items
      payload.items = payload.items.map((payloadProductItem) =>
        payloadProductItem.product.toString() === item.product.toString()
          ? {
              ...payloadProductItem,
              product: payloadProductItem.product,
              subTotal,
              taxAmount,
              netUnitPrice,
              productTaxRate: product.productTaxRate || 0,
            }
          : payloadProductItem,
      );

      // Determine quantity difference
      let quantityDifference = 0;
      if (item.isDeleted) {
        quantityDifference = -updatedItemQuantity;
      } else {
        quantityDifference = oldWarehouseStock
          ? updatedItemQuantity - oldWarehouseStock.quantity
          : updatedItemQuantity;
      }
      if (oldWarehouseStock || item.isDeleted) {
        await Product.findOneAndUpdate(
          { _id: item.product, 'stock.warehouse': payload.warehouse },
          { $inc: { 'stock.$.quantity': quantityDifference } },
          { session },
        );
      } else {
        await Product.findByIdAndUpdate(
          { _id: item.product },
          {
            $push: {
              stock: {
                warehouse: payload.warehouse,
                quantity: quantityDifference,
              },
            },
          },
          { session },
        );
      }
    }

    const result = await Purchase.findOneAndUpdate({ purchaseId }, payload, {
      session,
    });

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
