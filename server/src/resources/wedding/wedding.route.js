import { Router } from 'express';


const weddingRouter = Router();

weddingRouter
  .route('/')
  .get(getWedding)
  .post(createWedding);  

weddingRouter
  .route('/:id')
    .get(getWeddingById)
    .post(updateWeddingById)
   


export default weddingRouter;