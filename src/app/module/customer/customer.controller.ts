import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { CustomerService } from './customer.service';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status';

const getAllCustomer = catchAsync(async (req: Request, res: Response) => {
  const { result, meta } = await CustomerService.getAllCustomer(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Customers retrieved successfully.',
    meta,
    data: result,
  });
});

const getSingleCustomer = catchAsync(async (req: Request, res: Response) => {
  const result = await CustomerService.getSingleCustomer(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `Customer with ID ${req.params.id} get successfully.`,
    data: result,
  });
});

const updateCustomer = catchAsync(async (req: Request, res: Response) => {
  const result = await CustomerService.updateCustomer(req.params.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `Customer with ID ${req.params.id} updated successfully`,
    data: result,
  });
});

const deleteCustomer = catchAsync(async (req: Request, res: Response) => {
  const result = await CustomerService.deleteCustomer(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Customer deleted successfully',
    data: result,
  });
});

export const CustomerController = {
  getAllCustomer,
  getSingleCustomer,
  updateCustomer,
  deleteCustomer,
};
