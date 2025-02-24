import { Types } from 'mongoose';
import { BookSale } from '../bookSale/bookSale.model';
import { Customer } from '../customer/customer.model';
import { Employee } from '../employee/employee.model';

const getDashboardSummary = async (salesBy: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const matchFilter: any = {}; // Filter object

  if (salesBy) {
    matchFilter.saleBy = new Types.ObjectId(salesBy);
  }
  const result = await BookSale.aggregate([
    { $match: matchFilter },
    {
      $group: {
        _id: '_id',
        totalSellPrice: { $sum: '$totalAmount' },
        totalQuantitySold: { $sum: '$totalQuantitySold' },
        totalPaidAmount: { $sum: '$paidAmount' },
        totalDueAmount: { $sum: '$dueAmount' },
      },
    },
  ]);
  const totalCustomerCount = await Customer.find({}).estimatedDocumentCount();
  const totalEmployeeCount = await Employee.find({}).estimatedDocumentCount();
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - 30);

  const dailySalesData = await BookSale.aggregate([
    {
      $match: { saleDate: { $gte: startDate, $lte: today }, ...matchFilter },
    },
    {
      $group: {
        _id: {
          year: { $year: '$saleDate' },
          month: { $month: '$saleDate' },
          day: { $dayOfMonth: '$saleDate' },
        },
        sales: { $sum: '$totalAmount' },
        due: { $sum: '$dueAmount' },
        paid: { $sum: '$paidAmount' },
      },
    },
    {
      $project: {
        _id: 0,
        date: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: {
              $dateFromParts: {
                year: '$_id.year',
                month: '$_id.month',
                day: '$_id.day',
              },
            },
          },
        },
        sales: 1,
        due: 1,
        paid: 1,
      },
    },
    { $sort: { date: 1 } }, // Sort ascending by date
  ]);

  const last30Days = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    last30Days.push(date.toISOString().split('T')[0]); // "YYYY-MM-DD" format e store korsi
  }

  const finalDailySalesData = last30Days.map((date) => {
    const saleExistByDate = dailySalesData.find(
      (saleData) => saleData?.date === date,
    );
    return (
      saleExistByDate || {
        date,
        due: 0,
        paid: 0,
        sales: 0,
      }
    );
  });

  return {
    ...result[0],
    totalCustomerCount,
    totalEmployeeCount,
    dailySalesData: finalDailySalesData,
  };
};

export const DashboardOverviewService = {
  getDashboardSummary,
};
