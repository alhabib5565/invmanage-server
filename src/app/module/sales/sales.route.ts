import express from 'express';
import { SalesController } from './sales.controller';

const router = express.Router();

router.post('/create-sales', SalesController.createSales);
router.get('/', SalesController.getAllSales);
router.get('/:id', SalesController.getSingleSales);
router.patch('/:id', SalesController.updateSales);
router.delete('/:id', SalesController.deleteSales);

export const SalesRoutes = router;
