import { Router } from 'express';
import { createBudget, getBudget } from './budget.controller.js';


const budgetRouter = Router();

budgetRouter
  .route('/')
  .get(getBudget)
  .post(createBudget);  



export default budgetRouter;