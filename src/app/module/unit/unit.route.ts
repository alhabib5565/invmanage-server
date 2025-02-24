import express from 'express';
import { UnitController } from './unit.controller';

const router = express.Router();

router.post('/create-unit', UnitController.createUnit);
router.get('/', UnitController.getAllUnit);
router.get('/:id', UnitController.getSingleUnit);
router.patch('/:id', UnitController.updateUnit);
router.delete('/:id', UnitController.deleteUnit);

export const UnitRoutes = router;
