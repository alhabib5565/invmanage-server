import express from 'express';
import { employee_router } from '../module/employee/employee.route';
import { authRouter } from '../module/auth/auth.route';
import { UserRoutes } from '../module/user/user.route';
import { BookPurchaseRoutes } from '../module/bookPurchase/bookPurchase.route';
import { EmpBookAssignRoutes } from '../module/empBookAssign/empBookAssign.route';
import { BookSaleRoutes } from '../module/bookSale/bookSale.route';
import { BookRoutes } from '../module/book/book.route';
import { CustomerRoutes } from '../module/customer/customer.route';
import { PaymentRoutes } from '../module/paymentRecord/paymentRecord.route';
import { DashboardOverviewRoutes } from '../module/dashboardOverview/dashboardOverview.route';
import { BrandRoutes } from '../module/brand/brand.route';
import { CategoryRoutes } from '../module/category/category.route';
import { ProductRoutes } from '../module/product/product.route';

const router = express.Router();

const appRoutes = [
  {
    path: '/users',
    routes: UserRoutes,
  },
  {
    path: '/book-purchases',
    routes: BookPurchaseRoutes,
  },
  {
    path: '/employees',
    routes: employee_router,
  },
  {
    path: '/customers',
    routes: CustomerRoutes,
  },
  {
    path: '/brands',
    routes: BrandRoutes,
  },
  {
    path: '/categories',
    routes: CategoryRoutes,
  },
  {
    path: '/products',
    routes: ProductRoutes,
  },
  {
    path: '/books',
    routes: BookRoutes,
  },
  {
    path: '/emp-assigned-books',
    routes: EmpBookAssignRoutes,
  },
  {
    path: '/book-sales',
    routes: BookSaleRoutes,
  },
  {
    path: '/payments',
    routes: PaymentRoutes,
  },
  {
    path: '/auth',
    routes: authRouter,
  },
  {
    path: '/dashboard-overview',
    routes: DashboardOverviewRoutes,
  },
];

appRoutes.map((routes) => router.use(routes.path, routes.routes));

export const routes = router;
