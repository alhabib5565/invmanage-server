export const USER_ROLE = {
  superAdmin: 'superAdmin',
  admin: 'admin',
  customer: 'customer',
  employee: 'employee',
  'sales-executive': 'sales-executive',
} as const;

export const UserStatus = ['Active', 'Inactive', 'On Leave'] as const;

export const Gender = ['male', 'female', 'other'] as const;
