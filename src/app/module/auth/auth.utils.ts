import jwt, { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';
import { TUserRole } from '../user/user.interface';

type TJwtPayload = {
  mobileNumber: string;
  role: TUserRole;
  user_id: Types.ObjectId;
  userID: string;
};

export const createToken = (
  jwtPayload: TJwtPayload,
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const generateVerificationCode = () => {
  const verificationCode = Math.floor(1000 + Math.random() * 9000);
  const verificationExpires = Date.now() + 60000;
  return { verificationCode, verificationExpires };
};
