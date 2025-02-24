import express from 'express';
import { AuthController } from './auth.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';
import { auth } from '../../middlewares/auth';

const router = express.Router();

// router.post('/register-employee', AuthController.registerEmployee);

router.post(
  '/login',
  validateRequest(AuthValidation.loginEmployeeValidationSchema),
  AuthController.login,
);

router.post('/change-password', auth(), AuthController.changePassword);

router.post('/refresh-toekn', auth(), AuthController.refreshToken);

export const authRouter = router;
