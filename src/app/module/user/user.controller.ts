import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { UserService } from './user.service';
import httpStatus from 'http-status';

const createEmployee = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createEmployee(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Employee created successfully.',
    data: result,
  });
});

const createCustomer = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createCustomer(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Customer created successfully.',
    data: result,
  });
});

export const UserController = {
  createEmployee,
  createCustomer,
};
