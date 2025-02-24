import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { EmpBookAssignService } from './empBookAssign.service';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status';

const createEmpBookAssign = catchAsync(async (req: Request, res: Response) => {
  const result = await EmpBookAssignService.createEmpBookAssign(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'EmpBookAssign created successfully.',
    data: result,
  });
});

const getAllEmpBookAssign = catchAsync(async (req: Request, res: Response) => {
  const { result, meta } = await EmpBookAssignService.getAllEmpBookAssign(
    req.query,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'EmpBookAssigns retrieved successfully.',
    meta,
    data: result,
  });
});

const getSingleEmpBookAssign = catchAsync(
  async (req: Request, res: Response) => {
    const result = await EmpBookAssignService.getSingleEmpBookAssign(
      req.params.id,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: `EmpBookAssign with ID ${req.params.id} get successfully.`,
      data: result,
    });
  },
);

const updateEmpBookAssign = catchAsync(async (req: Request, res: Response) => {
  const result = await EmpBookAssignService.updateEmpBookAssign(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `EmpBookAssign with ID ${req.params.id} updated successfully`,
    data: result,
  });
});

const deleteEmpBookAssign = catchAsync(async (req: Request, res: Response) => {
  const result = await EmpBookAssignService.deleteEmpBookAssign(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: `EmpBookAssign with ID ${req.params.id} deleted successfully`,
    data: result,
  });
});

const assignedBooksToAnEmployee = catchAsync(
  async (req: Request, res: Response) => {
    const result = await EmpBookAssignService.assignedBooksToAnEmployee(
      req.params.id,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      message: `Get all assigned book by employee id`,
      data: result,
    });
  },
);

export const EmpBookAssignController = {
  createEmpBookAssign,
  getAllEmpBookAssign,
  getSingleEmpBookAssign,
  updateEmpBookAssign,
  deleteEmpBookAssign,
  assignedBooksToAnEmployee,
};
