import { Router } from 'express';


const budgetRouter = Router();

budgetRouter
  .route('/')
  .get(getBudget)
  .post(createBudget);  

budgetRouter
  .route('/:id')
    .get(getBudgetById)
    .post(updateBudgetById)
   


export default budgetRouter;