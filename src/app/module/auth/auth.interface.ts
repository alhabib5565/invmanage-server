import { TUser } from '../user/user.interface';

export type TLogin = Pick<TUser, 'mobileNumber' | 'password'>;

export type TVerifyEmailPayload = {
  verificationCode: number;
  email: string;
};
