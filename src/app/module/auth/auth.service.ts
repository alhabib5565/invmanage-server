import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import { TLogin } from './auth.interface';
import bcrypt from 'bcrypt';
import config from '../../config';
import { createToken, verifyToken } from './auth.utils';
import { JwtPayload } from 'jsonwebtoken';
import { User } from '../user/user.model';

const login = async (payload: TLogin) => {
  const user = await User.findOne({
    mobileNumber: payload.mobileNumber,
  }).select('+password');
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  if (user.status === 'Inactive') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user?.password,
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Password does not match!');
  }

  // payload related
  const jwtPayload = {
    mobileNumber: user.mobileNumber,
    role: user.role,
    user_id: user._id,
    userID: user.id,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: {
    oldPassword: string;
    newPassword: string;
  },
) => {
  const user = await User.findOne({
    mobileNumber: userData.mobileNumber,
    role: userData.role,
  }).select('+password');

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const isPasswordMatched = await bcrypt.compare(
    payload.oldPassword,
    user?.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Password does not mathched');
  }

  if (payload.oldPassword === payload.newPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Current password and new password are same',
    );
  }

  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  const result = await User.findOneAndUpdate(
    { mobileNumber: user.mobileNumber },
    {
      password: newHashedPassword,
      passwordChangeAt: new Date(),
    },

    {
      new: true,
    },
  );
  return result;
};

const refreshToken = async (token: string) => {
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
  }

  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const user = await User.findOne({
    email: decoded.email,
    role: decoded.role,
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // payload related
  const jwtPayload = {
    mobileNumber: user.mobileNumber,
    role: user.role,
    user_id: user._id,
    userID: user.id,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

export const AuthService = {
  login,
  refreshToken,
  changePassword,
};
