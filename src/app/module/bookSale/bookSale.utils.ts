import { BookSale } from './bookSale.model';

export const generateBookSaleId = async () => {
  let currentId = '0';

  const lastBookSaleId = await BookSale.findOne({}, { saleId: 1 }).sort({
    createdAt: -1,
  });
  if (lastBookSaleId) {
    currentId = lastBookSaleId.saleId;
  }
  return (Number(currentId) + 1).toString().padStart(4, '0');
};
