import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ProductService } from './product.service';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { deleteFileFromCloudinary } from '../../utils/sendFileToCloudinary';

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.createProduct(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Product created successfully.',
    data: result,
  });
});

const uploadProductImage = catchAsync(async (req: Request, res: Response) => {
  const file = req.file;
  const result = await ProductService.uploadProductImage(file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'File upload successfully.',
    data: result,
  });
});

const deleteProductImage = catchAsync(async (req: Request, res: Response) => {
  const { public_id } = req.params;

  const result = await deleteFileFromCloudinary(public_id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Image deleted successfully.',
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
  uploadProductImage,
  deleteProductImage,
};
