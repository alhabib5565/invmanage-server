import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { BookService } from './book.service';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createBook = catchAsync(async (req: Request, res: Response) => {
  const result = await BookService.createBook(req.body, req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Book created successfully.',
    data: result,
  });
});

const getAllBook = catchAsync(async (req: Request, res: Response) => {
  const { result, meta } = await BookService.getAllBook(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Books retrieved successfully.',
    meta,
    data: result,
  });
});

const getSingleBook = catchAsync(async (req: Request, res: Response) => {
  const result = await BookService.getSingleBook(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `Book with ID ${req.params.id} get successfully.`,
    data: result,
  });
});

const updateBook = catchAsync(async (req: Request, res: Response) => {
  const result = await BookService.updateBook(req.params.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `Book with ID ${req.params.id} updated successfully`,
    data: result,
  });
});

const deleteBook = catchAsync(async (req: Request, res: Response) => {
  const result = await BookService.deleteBook(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `Book with ID ${req.params.id} delete successfully`,
    data: result,
  });
});

const getBookStock = catchAsync(async (req: Request, res: Response) => {
  const result = await BookService.getBookStock();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `Book stock retrived successfully`,
    data: result,
  });
});

export const BookController = {
  createBook,
  getAllBook,
  getSingleBook,
  updateBook,
  deleteBook,
  getBookStock,
};
