import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { PaymentService } from './paymentRecord.services';

const createPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.createPayment(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Payment created successfully.',
    data: result,
  });
});

export const PaymentController = {
  createPayment,
};
