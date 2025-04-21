import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { SaleReturnService } from './salesReturn.services';

const createSaleReturn = catchAsync(async (req: Request, res: Response) => {
  const result = await SaleReturnService.createSaleReturn(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Sale Return successfully.',
    data: result,
  });
});

const getAllSaleReturn = catchAsync(async (req: Request, res: Response) => {
  const { result, meta } = await SaleReturnService.getAllSaleReturn(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Sale Returns retrieved successfully.',
    meta,
    data: result,
  });
});

const getSingleSaleReturn = catchAsync(async (req: Request, res: Response) => {
  const result = await SaleReturnService.getSingleSaleReturn(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `SaleReturn with ID ${req.params.id} get successfully.`,
    data: result,
  });
});

const updateSaleReturn = catchAsync(async (req: Request, res: Response) => {
  const result = await SaleReturnService.updateSaleReturn(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `SaleReturn with ID ${req.params.id} updated successfully`,
    data: result,
  });
});

const deleteSaleReturn = catchAsync(async (req: Request, res: Response) => {
  const result = await SaleReturnService.deleteSaleReturn(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `Book with ID ${req.params.id} delete successfully`,
    data: result,
  });
});

export const SaleReturnController = {
  createSaleReturn,
  getAllSaleReturn,
  getSingleSaleReturn,
  updateSaleReturn,
  deleteSaleReturn,
};
