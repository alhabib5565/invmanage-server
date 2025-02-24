import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { BrandService } from './brand.service';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createBrand = catchAsync(async (req: Request, res: Response) => {
  const result = await BrandService.createBrand(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Brand created successfully.',
    data: result,
  });
});

const getAllBrand = catchAsync(async (req: Request, res: Response) => {
  const { result, meta } = await BrandService.getAllBrand(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Brands retrieved successfully.',
    meta,
    data: result,
  });
});

const getSingleBrand = catchAsync(async (req: Request, res: Response) => {
  const result = await BrandService.getSingleBrand(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `Brand with ID ${req.params.id} get successfully.`,
    data: result,
  });
});

const updateBrand = catchAsync(async (req: Request, res: Response) => {
  const result = await BrandService.updateBrand(req.params.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `Brand with ID ${req.params.id} updated successfully`,
    data: result,
  });
});

const deleteBrand = catchAsync(async (req: Request, res: Response) => {
  const result = await BrandService.deleteBrand(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `Book with ID ${req.params.id} delete successfully`,
    data: result,
  });
});

export const BrandController = {
  createBrand,
  getAllBrand,
  getSingleBrand,
  updateBrand,
  deleteBrand,
};
