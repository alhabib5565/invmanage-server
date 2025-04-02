import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { SalesService } from './sales.service';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createSales = catchAsync(async (req: Request, res: Response) => {
  const result = await SalesService.createSales(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Sales created successfully.',
    data: result,
  });
});

const getAllSales = catchAsync(async (req: Request, res: Response) => {
  const { result, meta } = await SalesService.getAllSales(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Sales retrieved successfully.',
    meta,
    data: result,
  });
});

const getSingleSales = catchAsync(async (req: Request, res: Response) => {
  const result = await SalesService.getSingleSales(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `Sales with ID ${req.params.id} get successfully.`,
    data: result,
  });
});

const updateSales = catchAsync(async (req: Request, res: Response) => {
  const result = await SalesService.updateSales(req.params.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `Sales with ID ${req.params.id} updated successfully`,
    data: result,
  });
});

const deleteSales = catchAsync(async (req: Request, res: Response) => {
  const result = await SalesService.deleteSales(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: ` with ID ${req.params.id} delete successfully`,
    data: result,
  });
});

export const SalesController = {
  createSales,
  getAllSales,
  getSingleSales,
  updateSales,
  deleteSales,
};
