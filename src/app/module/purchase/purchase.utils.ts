import { TPurchaseItemWithQuanity } from './purchase.interface';
import { Purchase } from './purchase.model';

const findLastPurchase = async () => {
  const lastPurchase = await Purchase.findOne(
    {},
    {
      purchaseId: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();
  return lastPurchase?.purchaseId ? lastPurchase.purchaseId : undefined;
};

export const generatePurchaseId = async () => {
  let currentId = (0).toString();
  const lastPurchaseId = await findLastPurchase();
  if (lastPurchaseId) {
    currentId = lastPurchaseId.substring(3);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `PU-${incrementId}`;

  return incrementId;
};

export const calculateProductTotals = (product: TPurchaseItemWithQuanity) => {
  const {
    productPrice,
    quantity,
    productTaxRate = 0,
    taxType,
    discountAmount = 0,
  } = product;
  const discountedPrice = productPrice - discountAmount;

  const netUnitPrice =
    taxType === 'inclusive'
      ? discountedPrice / (1 + productTaxRate / 100)
      : discountedPrice;

  const taxAmount =
    taxType === 'inclusive'
      ? discountedPrice * quantity - netUnitPrice * quantity
      : ((netUnitPrice * productTaxRate) / 100) * quantity;

  const subTotal = netUnitPrice * quantity + taxAmount;

  return {
    taxAmount: parseFloat(taxAmount.toFixed(2)),
    subTotal: parseFloat(subTotal.toFixed(2)),
    netUnitPrice: parseFloat(netUnitPrice.toFixed(2)),
  };
};
