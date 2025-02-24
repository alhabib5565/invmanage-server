import { Types } from 'mongoose';
import { TGender } from '../user/user.interface';

export type TCustomer = {
  name: string;
  customerID: string;
  user: Types.ObjectId;
  gender: TGender;
  mobileNumber: string;
  email: string;
  companyName?: string;
  totalPurchased: number;
  totalPaid: number;
  totalDue: number;
  password: string;
  district: string;
  thana: string;
  homeAddress: string;
  salesExecutiveReference?: Types.ObjectId;
};
