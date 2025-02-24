import { USER_ROLE } from './user.constant';
import { TUserRole } from './user.interface';
import { User } from './user.model';

const findLastUserById = async (userRole: TUserRole) => {
  const lastEmployee = await User.findOne(
    {
      role: userRole,
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();
  return lastEmployee?.id ? lastEmployee.id : undefined;
};

export const generateEmployeeId = async () => {
  let currentId = (0).toString();
  const lastEmployeeId = await findLastUserById(USER_ROLE.employee);

  if (lastEmployeeId) {
    currentId = lastEmployeeId.substring(2);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `E-${incrementId}`;

  return incrementId;
};

export const generateAdminId = async () => {
  let currentId = (0).toString();
  const lastAdminId = await findLastUserById(USER_ROLE.admin);

  if (lastAdminId) {
    currentId = lastAdminId.substring(2);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `A-${incrementId}`;

  return incrementId;
};

export const generateSalesExecutiveId = async () => {
  let currentId = (0).toString();
  const lastSalesExecutiveId = await findLastUserById(
    USER_ROLE['sales-executive'],
  );

  if (lastSalesExecutiveId) {
    currentId = lastSalesExecutiveId.substring(2);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `S-${incrementId}`;

  return incrementId;
};

const findLastCustomerId = async () => {
  const lastCustomer = await User.findOne(
    {
      role: USER_ROLE.customer,
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastCustomer?.id ? lastCustomer.id : undefined;
};

export const generateCustomerId = async () => {
  let currentId = (0).toString();
  const lastCustomerId = await findLastCustomerId();

  if (lastCustomerId) {
    currentId = lastCustomerId.substring(2);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `C-${incrementId}`;

  return incrementId;
};
