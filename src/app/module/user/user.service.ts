/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import { TEmployee } from '../employee/employee.interface';
import { TUser } from './user.interface';
import { User } from './user.model';
import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import { Employee } from '../employee/employee.model';
import {
  generateAdminId,
  generateCustomerId,
  generateEmployeeId,
  generateSalesExecutiveId,
} from './user.utils';
import { USER_ROLE } from './user.constant';
import { TCustomer } from '../customer/customer.interface';
import { Customer } from '../customer/customer.model';

const createEmployee = async (payload: TEmployee) => {
  const userData: Partial<TUser> = {};

  userData.role = payload.role;
  userData.password = payload.password;
  userData.mobileNumber = payload.mobileNumber;
  userData.status = payload.employeeStatus;

  const session = await mongoose.startSession();

  try {
    if (payload.role === 'employee') {
      userData.id = await generateEmployeeId();
    } else if (payload.role === 'admin') {
      userData.id = await generateAdminId();
    } else if (payload.role === 'sales-executive') {
      userData.id = await generateSalesExecutiveId();
    }

    session.startTransaction();
    //set  generated id
    console.log(userData.id);

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a Employee (transaction-2)
    const newEmployee = await Employee.create([payload], { session });

    if (!newEmployee.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create employee');
    }

    await session.commitTransaction();
    await session.endSession();

    return newEmployee;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const createCustomer = async (payload: TCustomer) => {
  const userData: Partial<TUser> = {};

  userData.role = USER_ROLE.customer;
  userData.password = payload?.password || '123456';
  userData.mobileNumber = payload.mobileNumber;

  const session = await mongoose.startSession();

  // Check sales executive exist or not
  if (payload.salesExecutiveReference) {
    const salesExecutive = await Employee.findOne({
      _id: payload.salesExecutiveReference,
    });
    if (!salesExecutive) {
      throw new AppError(httpStatus.NOT_FOUND, 'Sales Executive not found!!');
    }
  }

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateCustomerId();

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    // set id , _id as user
    payload.customerID = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a Customer (transaction-2)
    const newCustomer = await Customer.create([payload], { session });

    if (!newCustomer.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create customer');
    }

    await session.commitTransaction();
    await session.endSession();

    return newCustomer;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const UserService = {
  createEmployee,
  createCustomer,
};
