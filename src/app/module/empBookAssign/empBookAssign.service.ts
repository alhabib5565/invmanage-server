import httpStatus from 'http-status';
import { QueryBuilder } from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { EmpBookAssign } from './empBookAssign.model';
import { generateEmpBookAssignId } from './empBookAssign.utils';
import { TEmpBookAssign } from './empBookAssign.interface';
import { Employee } from '../employee/employee.model';
import { Book } from '../book/book.model';
import { Types } from 'mongoose';

const createEmpBookAssign = async (payload: TEmpBookAssign) => {
  const employee = await Employee.findOne({ _id: payload.employee });
  if (!employee) {
    throw new AppError(httpStatus.NOT_FOUND, 'Employee not found!!');
  }

  const book = await Book.findOne({ _id: payload.book });
  if (!book) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Book not found!!');
  }

  payload.assignId = await generateEmpBookAssignId();
  const result = await EmpBookAssign.create(payload);
  return result;
};

const getAllEmpBookAssign = async (query: Record<string, unknown>) => {
  const searchAbleFields = ['name', 'email'];
  const employeeQuery = new QueryBuilder(
    query,
    EmpBookAssign.find().populate('employee').populate('book'),
  )
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

const getSingleEmpBookAssign = async (_id: string) => {
  const result = await EmpBookAssign.findOne({ _id });
  return result;
};

const updateEmpBookAssign = async (
  _id: string,
  payload: Partial<TEmpBookAssign>,
) => {
  const empBookAssign = await EmpBookAssign.findOne({ _id });
  if (!empBookAssign) {
    throw new AppError(httpStatus.NOT_FOUND, 'EmpBookAssign not found!!');
  }

  const result = await EmpBookAssign.findOneAndUpdate({ _id }, payload, {
    new: true,
  });
  return result;
};

const deleteEmpBookAssign = async (assignId: string) => {
  const empBookAssign = await EmpBookAssign.findOne({ assignId });
  if (!empBookAssign) {
    throw new AppError(httpStatus.NOT_FOUND, 'EmpBookAssign not found!!');
  }

  const result = await EmpBookAssign.findOneAndDelete({ assignId });
  return result;
};

const assignedBooksToAnEmployee = async (employee_id: string) => {
  const result = await EmpBookAssign.aggregate([
    // Step 1: Match only the assigned books for the given employee
    {
      $match: {
        employee: new Types.ObjectId(employee_id),
      },
    },

    // Step 2: Lookup book details from the 'books' collection
    {
      $lookup: {
        from: 'books',
        localField: 'book',
        foreignField: '_id',
        as: 'book',
      },
    },

    // Since 'book' is an array, we extract its object
    {
      $unwind: '$book',
    },

    // Step 3: Lookup sales details from 'booksales' collection
    {
      $lookup: {
        from: 'booksales',
        localField: 'book._id',
        foreignField: 'book',
        as: 'sales',
        pipeline: [
          {
            $match: {
              saleBy: new Types.ObjectId(employee_id),
            },
          },
          {
            $group: {
              _id: '$book',
              totalQuantitySold: { $sum: '$totalQuantitySold' },
              totalSoldPrice: {
                $sum: {
                  $multiply: ['$totalQuantitySold', '$sellingPricePerUnit'],
                },
              },
              avgSellingPrice: { $avg: '$sellingPricePerUnit' },
            },
          },
        ],
      },
    },
    {
      $unwind: '$sales',
    },
    // Step 4: Group data by book and calculate total assigned, sold, and average prices
    {
      $group: {
        _id: '$book._id',
        bookTitle: { $first: '$book.bookTitle' },
        totalAssignedQuantity: { $sum: '$quantityAssigned' },
        totalAssignedPrice: {
          $sum: {
            $multiply: ['$pricePerUnit', '$quantityAssigned'],
          },
        },
        avgAssignedPrice: { $avg: '$pricePerUnit' },

        totalQuantitySold: {
          $first: '$sales.totalQuantitySold',
        },
        totalSoldPrice: {
          $first: '$sales.totalSoldPrice',
        },

        avgSellingPrice: {
          $first: '$sales.avgSellingPrice',
        },
      },
    },
  ]);
  return result;
};

export const EmpBookAssignService = {
  createEmpBookAssign,
  getAllEmpBookAssign,
  getSingleEmpBookAssign,
  updateEmpBookAssign,
  deleteEmpBookAssign,
  assignedBooksToAnEmployee,
};
