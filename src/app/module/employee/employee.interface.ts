import { Types } from 'mongoose';
import { WorkShiftType } from './employee.constant';
import { TUserRole, TUserStatus } from '../user/user.interface';
export type TEmployee = {
  id: string;
  user: Types.ObjectId; //referenced
  role: TUserRole;
  employeeName: string;
  mobileNumber: string;
  email: string;
  password: string;
  emergencyContactNumber: string;
  birthDate?: Date;
  department: string;
  workShift: WorkShiftType;
  joiningDate: Date;
  designation: string;
  employeeStatus: TUserStatus;
  profileImage?: string;
};
