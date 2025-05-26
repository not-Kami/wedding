import { Router } from 'express';
import { createBudget, getBudget, updateBudget, deleteBudget } from './budget.controller.js';

const budgetRouter = Router();

// Routes pour '/'
budgetRouter
  .route('/')
  .get(getBudget)
  .post(createBudget);

// Routes pour '/:id'
budgetRouter
  .route('/:id')
  .put(updateBudget)
  .delete(deleteBudget);

export default budgetRouter;