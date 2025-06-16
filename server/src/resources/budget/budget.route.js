import { Router } from 'express';
import { createBudget, getBudgets, getBudgetById, updateBudget, deleteBudget } from './budget.controller.js';

const budgetRouter = Router();

// Routes pour '/'
budgetRouter
  .route('/')
  .get(getBudgets)
  .post(createBudget);

// Routes pour '/:id'
budgetRouter
  .route('/:id')
  .get(getBudgetById)
  .put(updateBudget)
  .delete(deleteBudget);

export default budgetRouter;