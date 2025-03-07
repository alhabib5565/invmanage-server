import express from 'express';
import { ProductController } from './product.controller';
import { upload } from '../../utils/sendFileToCloudinary';

const router = express.Router();

router.post('/create-product', ProductController.createProduct);
router.post(
  '/upload-product-image',
  upload.single('file'),
  ProductController.uploadProductImage,
);
router.delete(
  '/:public_id/delete-product-image',
  ProductController.deleteProductImage,
);
router.get('/', ProductController.getAllProduct);
router.get('/:id', ProductController.getSingleProduct);
router.patch('/:id', ProductController.updateProduct);
router.delete('/:id', ProductController.deleteProduct);

export const ProductRoutes = router;
