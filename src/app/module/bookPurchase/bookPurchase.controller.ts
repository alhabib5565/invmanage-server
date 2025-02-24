import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { BookPurchaseService } from './bookPurchase.service';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createBookPurchase = catchAsync(async (req: Request, res: Response) => {
  const result = await BookPurchaseService.createBookPurchase(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'BookPurchase created successfully.',
    data: result,
  });
});

const getAllBookPurchase = catchAsync(async (req: Request, res: Response) => {
  const { result, meta } = await BookPurchaseService.getAllBookPurchase(
    req.query,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'BookPurchases retrieved successfully.',
    meta,
    data: result,
  });
});

const getSingleBookPurchase = catchAsync(
  async (req: Request, res: Response) => {
    const result = await BookPurchaseService.getSingleBookPurchase(
      req.params.id,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: `BookPurchase with ID ${req.params.id} get successfully.`,
      data: result,
    });
  },
);

const updateBookPurchase = catchAsync(async (req: Request, res: Response) => {
  const result = await BookPurchaseService.updateBookPurchase(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `BookPurchase with ID ${req.params.id} updated successfully`,
    data: result,
  });
});

const deleteBookPurchase = catchAsync(async (req: Request, res: Response) => {
  const result = await BookPurchaseService.deleteBookPurchase(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `Book with ID ${req.params.id} delete successfully`,
    data: result,
  });
});

export const BookPurchaseController = {
  createBookPurchase,
  getAllBookPurchase,
  getSingleBookPurchase,
  updateBookPurchase,
  deleteBookPurchase,
};
