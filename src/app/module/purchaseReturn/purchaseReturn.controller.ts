import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { PurchaseReturnService } from './purchaseReturn.service';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createPurchaseReturn = catchAsync(async (req: Request, res: Response) => {
  const result = await PurchaseReturnService.createPurchaseReturn(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'PurchaseReturn created successfully.',
    data: result,
  });
});

const getAllPurchaseReturn = catchAsync(async (req: Request, res: Response) => {
  const { result, meta } = await PurchaseReturnService.getAllPurchaseReturn(
    req.query,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'PurchaseReturns retrieved successfully.',
    meta,
    data: result,
  });
});

const getSinglePurchaseReturn = catchAsync(
  async (req: Request, res: Response) => {
    const result = await PurchaseReturnService.getSinglePurchaseReturn(
      req.params.id,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: `PurchaseReturn with ID ${req.params.id} get successfully.`,
      data: result,
    });
  },
);

const updatePurchaseReturn = catchAsync(async (req: Request, res: Response) => {
  const result = await PurchaseReturnService.updatePurchaseReturn(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `PurchaseReturn with ID ${req.params.id} updated successfully`,
    data: result,
  });
});

const deletePurchaseReturn = catchAsync(async (req: Request, res: Response) => {
  const result = await PurchaseReturnService.deletePurchaseReturn(
    req.params.id,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `Book with ID ${req.params.id} delete successfully`,
    data: result,
  });
});

export const PurchaseReturnController = {
  createPurchaseReturn,
  getAllPurchaseReturn,
  getSinglePurchaseReturn,
  updatePurchaseReturn,
  deletePurchaseReturn,
};
