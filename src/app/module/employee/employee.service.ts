import httpStatus from 'http-status';
import { QueryBuilder } from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { TEmployee } from './employee.interface';
import { Employee } from './employee.model';
import { sendFileToCloudinary } from '../../utils/sendFileToCloudinary';
import { startSession } from 'mongoose';
import { User } from '../user/user.model';

const getAllEmployee = async (query: Record<string, unknown>) => {
  const searchAbleFields = ['name', 'email'];
  const employeeQuery = new QueryBuilder(query, Employee.find())
    .search(searchAbleFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await employeeQuery.countTotal();
  const result = await employeeQuery.modelQuery;
  return {
    meta,
    result,
  };
};

const getSingleEmployee = async (id: string) => {
  const result = await Employee.findOne({ id });
  return result;
};

const updateEmployee = async (id: string, payload: Partial<TEmployee>) => {
  const employee = await Employee.findOne({ id });
  if (!employee) {
    throw new AppError(httpStatus.NOT_FOUND, 'Employee not found!!');
  }

  const result = await Employee.findOneAndUpdate({ id }, payload, {
    new: true,
  });
  return result;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const uploadProfilePhoto = async (id: string, file: any) => {
  const employee = await Employee.findOne({ id });
  if (!employee) {
    throw new AppError(httpStatus.NOT_FOUND, 'Employee not found!!');
  }

  if (!file) {
    throw new AppError(httpStatus.NOT_FOUND, 'Profile image not found');
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const uploadedFileInfo: any = await sendFileToCloudinary({
    fileName: file.originalname,
    fileBuffer: file.buffer,
    resource_type: 'image',
  });
  const profileImage = uploadedFileInfo?.secure_url;

  const result = await Employee.findOneAndUpdate(
    { id },
    { profileImage },
    {
      new: true,
    },
  );
  return result;
};

const deleteEmployee = async (id: string) => {
  const session = await startSession();
  session.startTransaction();

  try {
    const employee = await Employee.findOne({ id }).populate('user'); // Populate the user field

    if (!employee) {
      throw new AppError(httpStatus.NOT_FOUND, 'Employee not found!!');
    }

    if (!employee.user) {
      //Check if user exists for this employee
      throw new AppError(
        httpStatus.NOT_FOUND,
        'User not found for this employee!!',
      );
    }

    // Use employee.user._id to delete the user (more reliable)
    await User.findByIdAndDelete(employee.user._id, { session });

    const result = await Employee.findOneAndDelete({ id }, { session }); // Pass the session here as well

    await session.commitTransaction();
    session.endSession();
    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const EmployeeService = {
  getAllEmployee,
  getSingleEmployee,
  updateEmployee,
  uploadProfilePhoto,
  deleteEmployee,
};
