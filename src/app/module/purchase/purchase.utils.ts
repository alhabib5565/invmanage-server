import { Purchase } from './purchase.model';

export const generatePurchaseId = async () => {
  let currentId = '0';

  const lastPurchaseId = await Purchase.findOne({}, { purchaseId: 1 }).sort({
    createdAt: -1,
  });
  if (lastPurchaseId) {
    currentId = lastPurchaseId.purchaseId;
  }
  return (Number(currentId) + 1).toString().padStart(4, '0');
};
