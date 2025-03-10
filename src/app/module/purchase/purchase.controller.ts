import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { PurchaseService } from './purchase.service';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createPurchase = catchAsync(async (req: Request, res: Response) => {
  const result = await PurchaseService.createPurchase(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Purchase created successfully.',
    data: result,
  });
});

const getAllPurchase = catchAsync(async (req: Request, res: Response) => {
  const { result, meta } = await PurchaseService.getAllPurchase(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Purchases retrieved successfully.',
    meta,
    data: result,
  });
});

const getSinglePurchase = catchAsync(async (req: Request, res: Response) => {
  const result = await PurchaseService.getSinglePurchase(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `Purchase with ID ${req.params.id} get successfully.`,
    data: result,
  });
});

const updatePurchase = catchAsync(async (req: Request, res: Response) => {
  const result = await PurchaseService.updatePurchase(req.params.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `Purchase with ID ${req.params.id} updated successfully`,
    data: result,
  });
});

const deletePurchase = catchAsync(async (req: Request, res: Response) => {
  const result = await PurchaseService.deletePurchase(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: ` with ID ${req.params.id} delete successfully`,
    data: result,
  });
});

export const PurchaseController = {
  createPurchase,
  getAllPurchase,
  getSinglePurchase,
  updatePurchase,
  deletePurchase,
};
