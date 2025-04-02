import { Sales } from './sales.model';

const findLastSales = async () => {
  const lastSales = await Sales.findOne(
    {},
    {
      salesId: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();
  return lastSales?.salesId ? lastSales.salesId : undefined;
};

export const generateSalesId = async () => {
  let currentId = (0).toString();
  const lastSalesId = await findLastSales();
  if (lastSalesId) {
    currentId = lastSalesId.substring(3);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `SA-${incrementId}`;

  return incrementId;
};
