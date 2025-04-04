/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { QueryBuilder } from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { Brand } from './brand.model';
import { TBrand } from './brand.interface';
import { generateSlug } from '../../utils/generateSlug';
import { sendFileToCloudinary } from '../../utils/sendFileToCloudinary';

const createBrand = async (payload: TBrand, file: any) => {
  // Upload Image
  if (file) {
    const imageUpload: any = await sendFileToCloudinary({
      fileName: file.originalname,
      fileBuffer: file.buffer,
      resource_type: 'image',
    });

    payload.logo = imageUpload.secure_url;
  }
  payload.slug = generateSlug(payload.name);
  const result = await Brand.create(payload);
  return result;
};

const getAllBrand = async (query: Record<string, unknown>) => {
  const searchAbleFields = ['name', 'slug', 'description'];
  const brandQuery = new QueryBuilder(query, Brand.find())
    .search(searchAbleFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await brandQuery.countTotal();
  const result = await brandQuery.modelQuery;
  return {
    meta,
    result,
  };
};

const getSingleBrand = async (slug: string) => {
  const result = await Brand.findOne({ slug });
  return result;
};

const updateBrand = async (slug: string, payload: Partial<TBrand>) => {
  const brand = await Brand.findOne({ slug });
  if (!brand) {
    throw new AppError(httpStatus.NOT_FOUND, 'Brand not found!!');
  }

  const result = await Brand.findOneAndUpdate({ slug }, payload, {
    new: true,
  });
  return result;
};

const deleteBrand = async (slug: string) => {
  const book = await Brand.findOne({ slug });
  if (!book) {
    throw new AppError(httpStatus.NOT_FOUND, 'Brand not found!!');
  }

  const result = await Brand.findOneAndDelete({ slug });
  return result;
};

export const BrandService = {
  createBrand,
  getAllBrand,
  getSingleBrand,
  updateBrand,
  deleteBrand,
};
