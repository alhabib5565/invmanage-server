import { TErrorPath, TErrorResponse } from '../interface/error';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleDuplicateError = (err: any): TErrorResponse => {
  const errorPaths: TErrorPath[] = [
    {
      path: '',
      message: err.message,
    },
  ];

  return {
    statusCode: 400,
    message: `${Object.keys(err.keyValue)[0]} Of ${[Object.values(err.keyValue)[0]]} already exists`,
    errorPaths,
  };
};
