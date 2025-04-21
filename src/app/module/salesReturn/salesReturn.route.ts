import express from 'express';
import { SaleReturnController } from './salesReturn.controller';

const router = express.Router();

router.post('/create-sale-return', SaleReturnController.createSaleReturn);
router.get('/', SaleReturnController.getAllSaleReturn);
router.get('/:id', SaleReturnController.getSingleSaleReturn);
router.patch('/:id', SaleReturnController.updateSaleReturn);
router.delete('/:id', SaleReturnController.deleteSaleReturn);

export const SaleReturnRoutes = router;
