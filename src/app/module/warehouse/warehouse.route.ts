import express from 'express';
import { WarehouseController } from './warehouse.controller';

const router = express.Router();

router.post('/create-warehouse', WarehouseController.createWarehouse);
router.get('/', WarehouseController.getAllWarehouse);
router.get('/:id', WarehouseController.getSingleWarehouse);
router.patch('/:id', WarehouseController.updateWarehouse);
router.delete('/:id', WarehouseController.deleteWarehouse);

export const WarehouseRoutes = router;
