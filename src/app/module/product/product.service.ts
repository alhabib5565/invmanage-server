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
import { sendFileToCloudinary } from '../../utils/sendFileToCloudinary';
import mongoose from 'mongoose';

const createProduct = async (payload: TProduct, file: any) => {
  if (!file) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Product image is not found');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Generate Slug and Product ID
    payload.slug = generateSlug(payload.name);
    payload.productID = await generateProductId();

    // Upload Image
    const imageUpload: any = await sendFileToCloudinary({
      fileName: file.originalname,
      fileBuffer: file.buffer,
      resource_type: 'image',
    });

    payload.image = imageUpload.secure_url;

    // Find Brand
    const brand = await Brand.findById(payload.brand).session(session);
    if (!brand) {
      throw new AppError(httpStatus.NOT_FOUND, 'Brand not found!!');
    }

    // Find Category
    const category = await Category.findById(payload.category).session(session);
    if (!category) {
      throw new AppError(httpStatus.NOT_FOUND, 'Category not found!!');
    }

    // Increment Product Count in Brand
    await Brand.findByIdAndUpdate(
      payload.brand,
      { $inc: { productCount: 1 } },
      { session },
    );

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

const getAllProduct = async (query: Record<string, unknown>) => {
  const searchAbleFields = ['name', 'slug'];
  const productQuery = new QueryBuilder(
    query,
    Product.find().populate('brand').populate('category'),
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

const getSingleProduct = async (productID: string) => {
  const result = await Product.findOne({ productID });
  return result;
};

const updateProduct = async (productID: string, payload: Partial<TProduct>) => {
  const product = await Product.findOne({ productID });
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, 'Product not found!!');
  }

  const result = await Product.findOneAndUpdate({ productID }, payload, {
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
};
