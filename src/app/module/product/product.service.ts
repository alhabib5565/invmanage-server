/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { QueryBuilder } from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { Product } from './product.model';
import { TProduct } from './product.interface';
import { generateSlug } from '../../utils/generateSlug';
import { generateProductId } from './product.utils';
import { Brand } from '../brand/brand.model';
import { Category } from '../category/category.model';
import {
  deleteFileFromCloudinary,
  sendFileToCloudinary,
} from '../../utils/sendFileToCloudinary';
import mongoose from 'mongoose';
import { Unit } from '../unit/unit.model';

const createProduct = async (payload: TProduct) => {
  const [purchaseUnit, saleUnit, brand, category] = await Promise.all([
    Unit.findOne({ _id: payload.purchaseUnit }).populate('baseUnit').lean(),
    Unit.findOne({ _id: payload.saleUnit }).lean(),
    Brand.findById(payload.brand).lean(),
    Category.findById(payload.category).lean(),
  ]);

  if (!purchaseUnit)
    throw new AppError(httpStatus.NOT_FOUND, 'Purchase Unit not found!!');
  if (!saleUnit)
    throw new AppError(httpStatus.NOT_FOUND, 'Sale Unit not found!!');
  if (!brand) throw new AppError(httpStatus.NOT_FOUND, 'Brand not found!!');
  if (!category)
    throw new AppError(httpStatus.NOT_FOUND, 'Category not found!!');

  const session = await mongoose.startSession();
  session.startTransaction();

  // Generate Slug and Product ID
  payload.slug = generateSlug(payload.productName);
  payload.productID = await generateProductId();

  try {
    // Increment Product Count in Brand

    await Brand.findByIdAndUpdate(
      payload.brand,
      { $inc: { productCount: 1 } },
      { session },
    ),
      // Increment Product Count in Category
      await Category.findByIdAndUpdate(
        payload.category,
        { $inc: { productCount: 1 } },
        { session },
      );

    // Create Product
    const product = await Product.create([payload], { session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return product;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error; // Rethrow for proper error handling
  }
};

const uploadProductImage = async (file: any) => {
  if (!file) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Product image is not found');
  }
  const imageUpload: any = await sendFileToCloudinary({
    fileName: file.originalname,
    fileBuffer: file.buffer,
    resource_type: 'image',
  });
  return imageUpload;
};

const deleteProductImage = async (public_id: string) => {
  if (!public_id) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Image Public ID is required');
  }
  const result = await deleteFileFromCloudinary(public_id);
  console.log(result);
  return result;
};

const getAllProduct = async (query: Record<string, unknown>) => {
  const searchAbleFields = [
    'productName',
    'slug',
    'productID',
    'code',
    'description',
  ];
  const productQuery = new QueryBuilder(
    query,
    Product.find()
      .populate('brand')
      .populate('category')
      .populate('productUnit'),
  )
    .search(searchAbleFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await productQuery.countTotal();
  const result = await productQuery.modelQuery;
  return {
    meta,
    result,
  };
};

const getSingleProduct = async (slug: string) => {
  const result = await Product.findOne({ slug })
    .populate('brand')
    .populate('category')
    .populate('productUnit')
    .populate('saleUnit')
    .populate('purchaseUnit');
  return result;
};

const updateProduct = async (slug: string, payload: Partial<TProduct>) => {
  const product = await Product.findOne({ slug });
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found!!');
  }

  const result = await Product.findOneAndUpdate({ slug }, payload, {
    new: true,
  });
  return result;
};

const deleteProduct = async (productID: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the product
    const product = await Product.findOne({ productID }).session(session);
    if (!product) {
      throw new AppError(httpStatus.NOT_FOUND, 'Product not found!!');
    }

    // Decrement product count in Brand
    await Brand.findByIdAndUpdate(
      product.brand,
      { $inc: { productCount: -1 } },
      { session },
    );

    // Decrement product count in Category
    await Category.findByIdAndUpdate(
      product.category,
      { $inc: { productCount: -1 } },
      { session },
    );

    // Delete the product
    const result = await Product.findOneAndDelete({ productID }).session(
      session,
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error; // Ensure proper error handling
  }
};

export const ProductService = {
  createProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  deleteProductImage,
};
