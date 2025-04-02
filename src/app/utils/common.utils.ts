import { TTaxType } from '../interface/golobal';

type TCalculateProductTotals = {
  productPrice: number;
  quantity: number;
  productTaxRate?: number;
  taxType: TTaxType;
  discountAmount?: number;
};

export const calculateProductTotals = (product: TCalculateProductTotals) => {
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
