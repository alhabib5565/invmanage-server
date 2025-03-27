import { PurchaseReturn } from './purchaseReturn.model';

const findLastPurchaseRetrun = async () => {
  const lastPurchaseRetrun = await PurchaseReturn.findOne(
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
  return lastPurchaseRetrun?.returnID ? lastPurchaseRetrun.returnID : undefined;
};

export const generatePurchaseReturnID = async () => {
  let currentId = (0).toString();
  const lastPurchaseRetrunId = await findLastPurchaseRetrun();
  if (lastPurchaseRetrunId) {
    currentId = lastPurchaseRetrunId.substring(3);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `PR-${incrementId}`;

  return incrementId;
};
