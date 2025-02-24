import express from 'express';
import { UserController } from './user.controller';

const router = express.Router();

router.post('/create-employee', UserController.createEmployee);
router.post('/create-customer', UserController.createCustomer);

export const UserRoutes = router;
