import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { BookSaleService } from './bookSale.service';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createBookSale = catchAsync(async (req: Request, res: Response) => {
  const result = await BookSaleService.createBookSale(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'BookSale created successfully.',
    data: result,
  });
});

const getAllBookSale = catchAsync(async (req: Request, res: Response) => {
  const { result, meta } = await BookSaleService.getAllBookSale(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'BookSales retrieved successfully.',
    meta,
    data: result,
  });
});

const getSingleBookSale = catchAsync(async (req: Request, res: Response) => {
  const result = await BookSaleService.getSingleBookSale(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `BookSale with ID ${req.params.id} get successfully.`,
    data: result,
  });
});

const updateBookSale = catchAsync(async (req: Request, res: Response) => {
  const result = await BookSaleService.updateBookSale(req.params.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `BookSale with ID ${req.params.id} updated successfully`,
    data: result,
  });
});

const deleteBookSale = catchAsync(async (req: Request, res: Response) => {
  const result = await BookSaleService.deleteBookSale(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `Delete sale with ID ${req.params.id} delete successfully`,
    data: result,
  });
});

export const BookSaleController = {
  createBookSale,
  getAllBookSale,
  getSingleBookSale,
  updateBookSale,
  deleteBookSale,
};
