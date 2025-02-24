import httpStatus from 'http-status';
import { QueryBuilder } from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { BookSale } from './bookSale.model';
import { generateBookSaleId } from './bookSale.utils';
import { TBookSale } from './bookSale.interface';
import { Book } from '../book/book.model';
import { Customer } from '../customer/customer.model';
import { Employee } from '../employee/employee.model';
import { TPaymentRecord } from '../paymentRecord/paymentRecord.interface';
import { startSession } from 'mongoose';
import { generatePaymentRecordId } from '../paymentRecord/paymentRecord.utils';
import { PaymentRecord } from '../paymentRecord/paymentRecord.model';

const createBookSale = async (payload: TBookSale) => {
  const book = await Book.findOne({ _id: payload.book });
  if (!book) {
    throw new AppError(httpStatus.NOT_FOUND, 'Book not found!!');
  }

  const customer = await Customer.findOne({ _id: payload.customer });
  if (!customer) {
    throw new AppError(httpStatus.NOT_FOUND, 'Customer not found!!');
  }

  const saleBy = await Employee.findOne({ _id: payload.saleBy });
  if (!saleBy) {
    throw new AppError(httpStatus.NOT_FOUND, 'Salse Executive not found!!');
  }

  const totalAmount = payload.totalQuantitySold * payload.sellingPricePerUnit;
  const paidAmount = payload.paidAmount;

  const session = await startSession();
  session.startTransaction();

  try {
    // Step 1: Sale Create
    payload.saleId = await generateBookSaleId();
    payload.dueAmount = totalAmount - paidAmount;
    payload.totalAmount = totalAmount;
    const saleData = await BookSale.create([payload], { session });

    // Step 2: Payment Collect (Jodi kono payment thake)
    if (payload.paidAmount > 0) {
      const paymentsData: Partial<TPaymentRecord> = {
        customer: payload.customer,
        collectedBy: payload.saleBy,
        sale: saleData[0]._id,
        paymentId: await generatePaymentRecordId(),
        amountCollected: paidAmount,
      };

      await PaymentRecord.create([paymentsData], { session });
    }

    // Step 3: Customer Update
    await Customer.findOneAndUpdate(
      { _id: payload.customer },
      {
        $inc: {
          totalPurchased: totalAmount,
          totalPaid: paidAmount,
          totalDue: totalAmount - paidAmount,
        },
      },
      { session },
    );

    // Step 4: Transaction Commit
    await session.commitTransaction();
    session.endSession();

    return saleData[0];
  } catch (error) {
    await session.abortTransaction(); // Rollback
    session.endSession();
    throw error;
  }
};

const getAllBookSale = async (query: Record<string, unknown>) => {
  const searchAbleFields = ['bookTitle'];
  const bookSaleQuery = new QueryBuilder(
    query,
    BookSale.find().populate('book').populate('saleBy').populate('customer'),
  )
    .search(searchAbleFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await bookSaleQuery.countTotal();
  const result = await bookSaleQuery.modelQuery;
  return {
    meta,
    result,
  };
};

const getSingleBookSale = async (_id: string) => {
  const result = await BookSale.findOne({ _id });
  return result;
};

const updateBookSale = async (_id: string, payload: Partial<TBookSale>) => {
  const bookSale = await BookSale.findOne({ _id });
  if (!bookSale) {
    throw new AppError(httpStatus.NOT_FOUND, 'BookSale not found!!');
  }

  const result = await BookSale.findOneAndUpdate({ _id }, payload, {
    new: true,
  });
  return result;
};

const deleteBookSale = async (saleId: string) => {
  const book = await BookSale.findOne({ saleId });
  if (!book) {
    throw new AppError(httpStatus.NOT_FOUND, 'BookSale not found!!');
  }

  const result = await BookSale.findOneAndDelete({ saleId });
  return result;
};

export const BookSaleService = {
  createBookSale,
  getAllBookSale,
  getSingleBookSale,
  updateBookSale,
  deleteBookSale,
};
