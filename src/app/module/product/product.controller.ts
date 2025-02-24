import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ProductService } from './product.service';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const file = req.file;
  console.log(file);
  const result = await ProductService.createProduct(req.body, file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Product created successfully.',
    data: result,
  });
});

const getAllProduct = catchAsync(async (req: Request, res: Response) => {
  const { result, meta } = await ProductService.getAllProduct(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Products retrieved successfully.',
    meta,
    data: result,
  });
});

const getSingleProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.getSingleProduct(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `Product with ID ${req.params.id} get successfully.`,
    data: result,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.updateProduct(req.params.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `Product with ID ${req.params.id} updated successfully`,
    data: result,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.deleteProduct(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `Book with ID ${req.params.id} delete successfully`,
    data: result,
  });
});

export const ProductController = {
  createProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
