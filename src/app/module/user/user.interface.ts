import { Gender, USER_ROLE, UserStatus } from './user.constant';

export interface TUser {
  id: string;
  mobileNumber: string;
  role: TUserRole;
  password: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  status: TUserStatus;
  isDeleted: boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
export type TUserStatus = (typeof UserStatus)[number];
export type TGender = (typeof Gender)[number];
