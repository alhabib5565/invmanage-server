import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { UnitService } from './unit.service';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createUnit = catchAsync(async (req: Request, res: Response) => {
  const result = await UnitService.createUnit(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Unit created successfully.',
    data: result,
  });
});

const getAllUnit = catchAsync(async (req: Request, res: Response) => {
  const { result, meta } = await UnitService.getAllUnit(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Units retrieved successfully.',
    meta,
    data: result,
  });
});

const getSingleUnit = catchAsync(async (req: Request, res: Response) => {
  const result = await UnitService.getSingleUnit(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `Unit with ID ${req.params.id} get successfully.`,
    data: result,
  });
});

const updateUnit = catchAsync(async (req: Request, res: Response) => {
  const result = await UnitService.updateUnit(req.params.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `Unit with ID ${req.params.id} updated successfully`,
    data: result,
  });
});

const deleteUnit = catchAsync(async (req: Request, res: Response) => {
  const result = await UnitService.deleteUnit(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `Book with ID ${req.params.id} delete successfully`,
    data: result,
  });
});

export const UnitController = {
  createUnit,
  getAllUnit,
  getSingleUnit,
  updateUnit,
  deleteUnit,
};
