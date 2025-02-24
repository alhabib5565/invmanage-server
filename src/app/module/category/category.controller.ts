import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { CategoryService } from './category.service';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.createCategory(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Category created successfully.',
    data: result,
  });
});

const getAllCategory = catchAsync(async (req: Request, res: Response) => {
  const { result, meta } = await CategoryService.getAllCategory(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Categorys retrieved successfully.',
    meta,
    data: result,
  });
});

const getSingleCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.getSingleCategory(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `Category with Slug ${req.params.id} get successfully.`,
    data: result,
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.updateCategory(req.params.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `Category with Slug ${req.params.id} updated successfully`,
    data: result,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryService.deleteCategory(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `Book with Slug ${req.params.id} delete successfully`,
    data: result,
  });
});

export const CategoryController = {
  createCategory,
  getAllCategory,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
