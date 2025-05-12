import { Router } from 'express';
import { createBudget, getBudget } from './budget.controller.js';


const budgetRouter = Router();

budgetRouter
  .route('/')
  .get(getBudget)
  .post(createBudget)
  .put('/:id', updateBudget)
  .delete('/:id', deleteBudget);  



export default budgetRouter;