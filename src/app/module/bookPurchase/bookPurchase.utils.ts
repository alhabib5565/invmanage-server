import { BookPurchase } from './bookPurchase.model';

export const generateBookPurchaseId = async () => {
  let currentId = '0';

  const lastBookPurchaseId = await BookPurchase.findOne(
    {},
    { parchaseBookId: 1 },
  ).sort({
    createdAt: -1,
  });
  if (lastBookPurchaseId) {
    currentId = lastBookPurchaseId.parchaseBookId;
  }
  return (Number(currentId) + 1).toString().padStart(4, '0');
};
