import httpStatus from 'http-status';
import { QueryBuilder } from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { TCustomer } from './customer.interface';
import { Customer } from './customer.model';
import { User } from '../user/user.model';
import { startSession } from 'mongoose';

const getAllCustomer = async (query: Record<string, unknown>) => {
  const searchAbleFields = [
    'name',
    'email',
    'companyName',
    'mobileNumber',
    'gender',
    'mobileNumber',
    'customerID',
    'homeAddress',
    'district',
  ];
  const customerQuery = new QueryBuilder(query, Customer.find())
    .search(searchAbleFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await customerQuery.countTotal();
  const result = await customerQuery.modelQuery;
  return {
    meta,
    result,
  };
};

const getSingleCustomer = async (customerID: string) => {
  const result = await Customer.findOne({ customerID });
  return result;
};

const updateCustomer = async (
  customerID: string,
  payload: Partial<TCustomer>,
) => {
  const customer = await Customer.findOne({ customerID });
  if (!customer) {
    throw new AppError(httpStatus.NOT_FOUND, 'Customer not found!!');
  }

  const result = await Customer.findOneAndUpdate({ customerID }, payload, {
    new: true,
  });
  return result;
};

const deleteCustomer = async (customerID: string) => {
  const session = await startSession();
  session.startTransaction();

  try {
    const customer = await Customer.findOne({ customerID }).populate('user'); // Populate the user field

    if (!customer) {
      throw new AppError(httpStatus.NOT_FOUND, 'Customer not found!!');
    }

    if (!customer.user) {
      //Check if user exists for this customer
      throw new AppError(
        httpStatus.NOT_FOUND,
        'User not found for this customer!!',
      );
    }

    // Use customer.user._id to delete the user (more reliable)
    await User.findByIdAndDelete(customer.user._id, { session });

    const result = await Customer.findOneAndDelete({ customerID }, { session }); // Pass the session here as well

    await session.commitTransaction();
    session.endSession();
    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const CustomerService = {
  getAllCustomer,
  getSingleCustomer,
  updateCustomer,
  deleteCustomer,
};
