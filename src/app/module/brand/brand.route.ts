import express from 'express';
import { BrandController } from './brand.controller';

const router = express.Router();

router.post('/create-brand', BrandController.createBrand);
router.get('/', BrandController.getAllBrand);
router.get('/:id', BrandController.getSingleBrand);
router.patch('/:id', BrandController.updateBrand);
router.delete('/:id', BrandController.deleteBrand);

export const BrandRoutes = router;
