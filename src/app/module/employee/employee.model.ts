import { model, Schema } from 'mongoose';
import { TEmployee } from './employee.interface';
import { WORK_SHIFTS } from './employee.constant';

const employeeSchema = new Schema<TEmployee>(
  {
    id: {
      type: String,
      required: [true, 'EmployeeId is Required'],
      unique: true,
    },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    employeeName: { type: String, required: true },
    role: { type: String, required: true }, // employee || admin
    mobileNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    emergencyContactNumber: { type: String, required: true },
    birthDate: { type: Date },
    department: { type: String, required: true },
    workShift: { type: String, enum: WORK_SHIFTS, required: true },
    joiningDate: { type: Date, required: true },
    designation: { type: String, required: true },
    profileImage: { type: String },
  },
  { timestamps: true },
);

export const Employee = model('Employee', employeeSchema);
