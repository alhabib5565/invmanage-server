/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { handleZodError } from '../error/handleZodError';
import { TErrorResponse } from '../interface/error';
import { handleValidationError } from '../error/validationError';
import { handleCastError } from '../error/handleCastError';
import { handleDuplicateError } from '../error/handleDuplicateError';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next,
) => {
  // console.log(err);

  let errorResponse: TErrorResponse = {
    statusCode: 500,
    message: 'something went wrong',
    errorPaths: [
      {
        path: '',
        message: '',
      },
    ],
  };

  if (err instanceof ZodError) {
    errorResponse = handleZodError(err);
  } else if (err?.name === 'ValidationError') {
    errorResponse = handleValidationError(err);
  } else if (err?.name === 'CastError') {
    errorResponse = handleCastError(err);
  } else if (err?.code === 11000) {
    errorResponse = handleDuplicateError(err);
  } else if (err instanceof Error) {
    errorResponse.message = err.message;
  }

  res.status(errorResponse.statusCode).json({
    success: false,
    statusCode: errorResponse.statusCode,
    message: errorResponse.message,
    errorPaths: errorResponse.errorPaths,
    error: err,
  });
};
