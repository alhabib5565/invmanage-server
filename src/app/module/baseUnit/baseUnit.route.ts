import express from 'express';
import { BaseUnitController } from './baseUnit.controller';

const router = express.Router();

router.post('/create-base-unit', BaseUnitController.createBaseUnit);
router.get('/', BaseUnitController.getAllBaseUnit);
router.get('/:id', BaseUnitController.getSingleBaseUnit);
router.patch('/:id', BaseUnitController.updateBaseUnit);
router.delete('/:id', BaseUnitController.deleteBaseUnit);

export const BaseUnitRoutes = router;
