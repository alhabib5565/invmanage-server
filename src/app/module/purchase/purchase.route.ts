import express from 'express';
import { PurchaseController } from './purchase.controller';

const router = express.Router();

router.post('/create-purchase', PurchaseController.createPurchase);
router.get('/', PurchaseController.getAllPurchase);
router.get('/:id', PurchaseController.getSinglePurchase);
router.patch('/:id', PurchaseController.updatePurchase);
router.delete('/:id', PurchaseController.deletePurchase);

export const PurchaseRoutes = router;
