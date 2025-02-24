import express from 'express';
import { BookController } from './book.controller';
import { auth } from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post('/create-book', auth(USER_ROLE.admin), BookController.createBook);
router.get('/', BookController.getAllBook);
router.get('/stock/get-book-stock', BookController.getBookStock);
router.get('/:id', BookController.getSingleBook);
router.patch('/:id', BookController.updateBook);
router.delete('/:id', BookController.deleteBook);

export const BookRoutes = router;
