import { Response } from 'express';

type TMeta = {
  total: number;
  page: number;
  limit: number;
  totalPage: number;
};

type TResponse<T> = {
  message: string;
  statusCode: number;
  success?: boolean;
  meta?: TMeta;
  data: T;
};

export const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success || true,
    message: data.message,
    meta: data.meta,
    data: data.data,
  });
};
