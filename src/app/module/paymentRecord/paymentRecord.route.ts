import express from 'express';
import { PaymentController } from './paymentRecord.controller';
const router = express.Router();

router.post('/create-payment', PaymentController.createPayment);

export const PaymentRoutes = router;
