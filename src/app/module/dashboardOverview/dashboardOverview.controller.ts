import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { DashboardOverviewService } from './dashboardOverview.service';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status';

const getDashboardSummary = catchAsync(async (req: Request, res: Response) => {
  const salesBy = req?.query?.salesBy as string;
  const result = await DashboardOverviewService.getDashboardSummary(
    salesBy || '',
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Dashboard summary card data retrieved successfully.',
    data: result,
  });
});

export const DashboardOverviewController = {
  getDashboardSummary,
};
