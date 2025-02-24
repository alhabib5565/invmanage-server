import express, { NextFunction, Request, Response } from 'express';
import { ProductController } from './product.controller';
import { upload } from '../../utils/sendFileToCloudinary';

const router = express.Router();

router.post(
  '/create-product',
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  ProductController.createProduct,
);
router.get('/', ProductController.getAllProduct);
router.get('/:id', ProductController.getSingleProduct);
router.patch('/:id', ProductController.updateProduct);
router.delete('/:id', ProductController.deleteProduct);

export const ProductRoutes = router;
