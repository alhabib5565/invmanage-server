import express from 'express';
import { CustomerController } from './customer.controller';
import { upload } from '../../utils/sendFileToCloudinary';

const router = express.Router();

router.get('/', CustomerController.getAllCustomer);
router.get('/:id', CustomerController.getSingleCustomer);
router.patch('/:id', CustomerController.updateCustomer);
router.delete('/:id', upload.single('file'), CustomerController.deleteCustomer);

export const CustomerRoutes = router;
