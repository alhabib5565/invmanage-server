import express, { NextFunction, Request, Response } from 'express';
import { BrandController } from './brand.controller';
import { upload } from '../../utils/sendFileToCloudinary';

const router = express.Router();

router.post(
  '/create-brand',
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  BrandController.createBrand,
);
router.get('/', BrandController.getAllBrand);
router.get('/:id', BrandController.getSingleBrand);
router.patch('/:id', BrandController.updateBrand);
router.delete('/:id', BrandController.deleteBrand);

export const BrandRoutes = router;
