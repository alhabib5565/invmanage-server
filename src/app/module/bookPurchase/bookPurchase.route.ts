import express from 'express';
import { BookPurchaseController } from './bookPurchase.controller';

const router = express.Router();

router.post('/create-book-purchase', BookPurchaseController.createBookPurchase);
router.get('/', BookPurchaseController.getAllBookPurchase);
router.get('/:id', BookPurchaseController.getSingleBookPurchase);
router.patch('/:id', BookPurchaseController.updateBookPurchase);
router.delete('/:id', BookPurchaseController.deleteBookPurchase);

export const BookPurchaseRoutes = router;
