import { SaleReturn } from './salesReturn.model';

const findLastSaleRetrun = async () => {
  const lastSaleRetrun = await SaleReturn.findOne(
    {},
    {
      returnID: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();
  return lastSaleRetrun?.returnID ? lastSaleRetrun.returnID : undefined;
};

export const generateSaleReturnID = async () => {
  let currentId = (0).toString();
  const lastSaleRetrunId = await findLastSaleRetrun();
  if (lastSaleRetrunId) {
    currentId = lastSaleRetrunId.substring(3);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `SR-${incrementId}`;

  return incrementId;
};
