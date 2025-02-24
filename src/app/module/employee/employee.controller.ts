import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { EmployeeService } from './employee.service';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status';

const getAllEmployee = catchAsync(async (req: Request, res: Response) => {
  const { result, meta } = await EmployeeService.getAllEmployee(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Employees retrieved successfully.',
    meta,
    data: result,
  });
});

const getSingleEmployee = catchAsync(async (req: Request, res: Response) => {
  const result = await EmployeeService.getSingleEmployee(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `Employee with ID ${req.params.id} get successfully.`,
    data: result,
  });
});

const updateEmployee = catchAsync(async (req: Request, res: Response) => {
  const result = await EmployeeService.updateEmployee(req.params.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `Employee with ID ${req.params.id} updated successfully`,
    data: result,
  });
});

const uploadProfilePhoto = catchAsync(async (req: Request, res: Response) => {
  const result = await EmployeeService.uploadProfilePhoto(
    req.params.id,
    req?.file,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile photo upload successfull',
    data: result,
  });
});

const deleteEmployee = catchAsync(async (req: Request, res: Response) => {
  const result = await EmployeeService.deleteEmployee(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Employee with ID ${req.params.id} delete successfully`,
    data: result,
  });
});

export const EmployeeController = {
  getAllEmployee,
  getSingleEmployee,
  updateEmployee,
  uploadProfilePhoto,
  deleteEmployee,
};
