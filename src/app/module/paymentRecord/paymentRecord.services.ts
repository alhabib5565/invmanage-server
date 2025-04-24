import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import { Customer } from '../customer/customer.model';
import { TPaymentRecord } from './paymentRecord.interface';
import { BookSale } from '../bookSale/bookSale.model';
import { Employee } from '../employee/employee.model';
import { startSession } from 'mongoose';
import { generatePaymentRecordId } from './paymentRecord.utils';
import { PaymentRecord } from './paymentRecord.model';

const createPayment = async (payload: TPaymentRecord) => {
  const customer = await Customer.findOne({ _id: payload.customer });
  if (!customer)
    throw new AppError(httpStatus.NOT_FOUND, 'Customer not found!!');

  const sale = await BookSale.findOne({ _id: payload.sale });
  if (!sale)
    throw new AppError(httpStatus.NOT_FOUND, 'Sale record not found!!');

  if (sale?.dueAmount && sale?.dueAmount < payload.amount) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You've paid more than the due amount.`,
    );
  }

  const collectedBy = await Employee.findOne({ _id: payload.collectedBy });
  if (!collectedBy)
    throw new AppError(httpStatus.NOT_FOUND, 'Sales Executive not found!!');

  const session = await startSession();
  session.startTransaction();

  try {
    // Step 1: Payment Create
    payload.paymentId = await generatePaymentRecordId();
    const payment = await PaymentRecord.create([{ ...payload }], { session });

    // Step 2: Customer Update (totalPaid & totalDue)
    await Customer.findOneAndUpdate(
      { _id: payload.customer },
      {
        $inc: {
          totalPaid: payload.amount,
          totalDue: -payload.amount, // Reduce Due
        },
      },
      { session },
    );

    // Step 3: Sale Update (Reduce Due)
    await BookSale.findOneAndUpdate(
      { _id: payload.sale },
      {
        $inc: {
          dueAmount: -payload.amount,
          paidAmount: payload.amount,
        }, // Reduce Sale Due
      },
      { session },
    );

    await session.commitTransaction();
    return payment;
  } catch (error) {
    await session.abortTransaction(); // Rollback on error
    throw error;
  } finally {
    session.endSession();
  }
};

export const PaymentService = {
  createPayment,
};
