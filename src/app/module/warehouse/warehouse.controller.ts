import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { WarehouseService } from './warehouse.service';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createWarehouse = catchAsync(async (req: Request, res: Response) => {
  const result = await WarehouseService.createWarehouse(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Warehouse created successfully.',
    data: result,
  });
});

const getAllWarehouse = catchAsync(async (req: Request, res: Response) => {
  const { result, meta } = await WarehouseService.getAllWarehouse(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Warehouses retrieved successfully.',
    meta,
    data: result,
  });
});

const getSingleWarehouse = catchAsync(async (req: Request, res: Response) => {
  const result = await WarehouseService.getSingleWarehouse(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `Warehouse with ID ${req.params.id} get successfully.`,
    data: result,
  });
});

const updateWarehouse = catchAsync(async (req: Request, res: Response) => {
  const result = await WarehouseService.updateWarehouse(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `Warehouse with ID ${req.params.id} updated successfully`,
    data: result,
  });
});

const deleteWarehouse = catchAsync(async (req: Request, res: Response) => {
  const result = await WarehouseService.deleteWarehouse(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `Book with ID ${req.params.id} delete successfully`,
    data: result,
  });
});

export const WarehouseController = {
  createWarehouse,
  getAllWarehouse,
  getSingleWarehouse,
  updateWarehouse,
  deleteWarehouse,
};
