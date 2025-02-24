import httpStatus from 'http-status';
import { QueryBuilder } from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { Book } from './book.model';
import { generateBookId } from './book.utils';
import { TBook } from './book.interface';
import { JwtPayload } from 'jsonwebtoken';

const createBook = async (payload: TBook, user: JwtPayload) => {
  payload.bookID = await generateBookId();
  payload.createdBy = user.user_id;
  const result = await Book.create(payload);
  return result;
};

const getAllBook = async (query: Record<string, unknown>) => {
  const searchAbleFields = ['bookTitle'];
  const employeeQuery = new QueryBuilder(query, Book.find())
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

const getSingleBook = async (bookID: string) => {
  const result = await Book.findOne({ bookID });
  return result;
};

const updateBook = async (bookID: string, payload: Partial<TBook>) => {
  const book = await Book.findOne({ bookID });
  if (!book) {
    throw new AppError(httpStatus.NOT_FOUND, 'Book not found!!');
  }

  const result = await Book.findOneAndUpdate({ bookID }, payload, {
    new: true,
  });
  return result;
};

const deleteBook = async (bookID: string) => {
  const book = await Book.findOne({ bookID });
  if (!book) {
    throw new AppError(httpStatus.NOT_FOUND, 'Book not found!!');
  }

  const result = await Book.findOneAndDelete({ bookID });
  return result;
};

const getBookStock = async () => {
  const result = await Book.aggregate([
    {
      $lookup: {
        from: 'bookpurchases',
        localField: '_id',
        foreignField: 'book',
        pipeline: [
          {
            $group: {
              _id: null,
              totalPurchased: { $sum: '$quantityPurchased' },
              avgPricePerUnit: { $avg: '$purchasePricePerUnit' },
              totalPurchasePrice: {
                $sum: {
                  $multiply: ['$quantityPurchased', '$purchasePricePerUnit'],
                },
              },
            },
          },
        ],
        as: 'purchasesBook',
      },
    },
    {
      $lookup: {
        from: 'booksales',
        localField: '_id',
        foreignField: 'book',
        pipeline: [
          {
            $group: {
              _id: null,
              totalSold: { $sum: '$totalQuantitySold' },
              avgPricePerUnit: { $avg: '$sellingPricePerUnit' },
              totalSalePrice: {
                $sum: {
                  $multiply: ['$totalQuantitySold', '$sellingPricePerUnit'],
                },
              },
            },
          },
        ],
        as: 'salesBook',
      },
    },

    {
      $lookup: {
        from: 'empbookassigns',
        localField: '_id',
        foreignField: 'book',
        pipeline: [
          {
            $group: {
              _id: null,
              totalAssignedQuantity: { $sum: '$quantityAssigned' },
            },
          },
        ],
        as: 'assignedBook',
      },
    },

    {
      $project: {
        bookTitle: '$bookTitle',
        bookID: '$bookID',
        totalPurchasedQuantity: {
          $arrayElemAt: ['$purchasesBook.totalPurchased', 0],
        },
        totalPurchasePrice: {
          $arrayElemAt: ['$purchasesBook.totalPurchasePrice', 0],
        },
        avgPurchasesPricePerUnit: {
          $arrayElemAt: ['$purchasesBook.avgPricePerUnit', 0],
        },

        totalSoldQuantity: {
          $arrayElemAt: ['$salesBook.totalSold', 0],
        },
        totalSoldPrice: {
          $arrayElemAt: ['$salesBook.totalSalePrice', 0],
        },
        avgSoldPricePerUnit: {
          $arrayElemAt: ['$salesBook.avgPricePerUnit', 0],
        },

        // available stcok calculation
        availableStock: {
          $subtract: [
            { $arrayElemAt: ['$purchasesBook.totalPurchased', 0] },
            { $arrayElemAt: ['$assignedBook.totalAssignedQuantity', 0] },
          ],
        },

        // remaining assigned book
        remainingAssignedBook: {
          $subtract: [
            { $arrayElemAt: ['$assignedBook.totalAssignedQuantity', 0] },
            { $arrayElemAt: ['$salesBook.totalSold', 0] },
          ],
        },
      },
    },
  ]);
  return result;
};

export const BookService = {
  createBook,
  getAllBook,
  getSingleBook,
  updateBook,
  deleteBook,
  getBookStock,
};
