import express from 'express';
import { DashboardOverviewController } from './dashboardOverview.controller';

const router = express.Router();

router.get('/summary', DashboardOverviewController.getDashboardSummary);

export const DashboardOverviewRoutes = router;
