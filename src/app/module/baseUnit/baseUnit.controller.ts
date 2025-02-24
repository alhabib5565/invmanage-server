import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { BaseUnitService } from './baseUnit.service';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createBaseUnit = catchAsync(async (req: Request, res: Response) => {
  const result = await BaseUnitService.createBaseUnit(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'BaseUnit created successfully.',
    data: result,
  });
});

const getAllBaseUnit = catchAsync(async (req: Request, res: Response) => {
  const { result, meta } = await BaseUnitService.getAllBaseUnit(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'BaseUnits retrieved successfully.',
    meta,
    data: result,
  });
});

const getSingleBaseUnit = catchAsync(async (req: Request, res: Response) => {
  const result = await BaseUnitService.getSingleBaseUnit(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `BaseUnit with ID ${req.params.id} get successfully.`,
    data: result,
  });
});

const updateBaseUnit = catchAsync(async (req: Request, res: Response) => {
  const result = await BaseUnitService.updateBaseUnit(req.params.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `BaseUnit with ID ${req.params.id} updated successfully`,
    data: result,
  });
});

const deleteBaseUnit = catchAsync(async (req: Request, res: Response) => {
  const result = await BaseUnitService.deleteBaseUnit(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `Book with ID ${req.params.id} delete successfully`,
    data: result,
  });
});

export const BaseUnitController = {
  createBaseUnit,
  getAllBaseUnit,
  getSingleBaseUnit,
  updateBaseUnit,
  deleteBaseUnit,
};
