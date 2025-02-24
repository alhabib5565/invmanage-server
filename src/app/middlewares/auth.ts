import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import AppError from '../error/AppError';
import httpStatus from 'http-status';
import { verifyToken } from '../module/auth/auth.utils';
import config from '../config';
import { TUserRole } from '../module/user/user.interface';
import { User } from '../module/user/user.model';

export const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    const decoded = verifyToken(token, config.jwt_access_secret as string);
    const user = await User.findOne({
      mobileNumber: decoded.mobileNumber,
      role: decoded.role,
    });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    if (user.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
    }

    if (user.status === 'Inactive') {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is Inactive ! !');
    }

    if (requiredRoles.length > 0 && !requiredRoles.includes(decoded.role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You are not authorized  hi!',
      );
    }
    req.user = decoded;
    next();
  });
};
