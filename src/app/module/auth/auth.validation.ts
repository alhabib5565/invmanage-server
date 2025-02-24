import { z } from 'zod';

const loginEmployeeValidationSchema = z.object({
  mobileNumber: z.string().min(1, { message: 'Mobile Number is required' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' })
    .min(1, { message: 'Password is required' }),
});

const verifyEmailValidationSchema = z.object({
  verificationCode: z.number({
    required_error: 'Please provide Varification code',
  }),
  email: z
    .string()
    .email({ message: 'Invalid email format' })
    .min(1, { message: 'Email is required' }),
});

const verifyResendVerificationCode = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email format' })
    .min(1, { message: 'Email is required' }),
});

export const AuthValidation = {
  loginEmployeeValidationSchema,
  verifyEmailValidationSchema,
  verifyResendVerificationCode,
};
