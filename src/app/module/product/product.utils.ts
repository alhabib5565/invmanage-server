import { Product } from './product.model';

const findLastProductId = async () => {
  const lastProduct = await Product.findOne({}, { productID: 1, _id: 0 })
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastProduct?.productID ? lastProduct.productID : undefined;
};

export const generateProductId = async () => {
  let currentId = (0).toString();
  const lastProductId = await findLastProductId();

  if (lastProductId) {
    currentId = lastProductId.substring(4);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `PRD-${incrementId}`;

  return incrementId;
};
