import express from 'express';
import { PurchaseReturnController } from './purchaseReturn.controller';

const router = express.Router();

router.post(
  '/create-purchase-retrun',
  PurchaseReturnController.createPurchaseReturn,
);
router.get('/', PurchaseReturnController.getAllPurchaseReturn);
router.get('/:id', PurchaseReturnController.getSinglePurchaseReturn);
router.patch('/:id', PurchaseReturnController.updatePurchaseReturn);
router.delete('/:id', PurchaseReturnController.deletePurchaseReturn);

export const PurchaseReturnRoutes = router;
