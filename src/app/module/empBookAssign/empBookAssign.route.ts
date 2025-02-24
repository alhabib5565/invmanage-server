import express from 'express';
import { EmpBookAssignController } from './empBookAssign.controller';

const router = express.Router();

router.post(
  '/create-emp-books-assign',
  EmpBookAssignController.createEmpBookAssign,
);
router.get(
  '/:id/assigned-books-by-employee',
  EmpBookAssignController.assignedBooksToAnEmployee,
);
router.get('/', EmpBookAssignController.getAllEmpBookAssign);
router.get('/:id', EmpBookAssignController.getSingleEmpBookAssign);
router.patch('/:id', EmpBookAssignController.updateEmpBookAssign);
router.patch('/:id', EmpBookAssignController.deleteEmpBookAssign);

export const EmpBookAssignRoutes = router;
