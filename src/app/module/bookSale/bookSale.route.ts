import express from 'express';
import { BookSaleController } from './bookSale.controller';

const router = express.Router();

router.post('/create-book-sale', BookSaleController.createBookSale);
router.get('/', BookSaleController.getAllBookSale);
router.get('/:id', BookSaleController.getSingleBookSale);
router.patch('/:id', BookSaleController.updateBookSale);
router.delete('/:id', BookSaleController.deleteBookSale);

export const BookSaleRoutes = router;
