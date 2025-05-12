import { Router } from 'express';
import { createWedding, getWedding } from './wedding.controller.js';


const weddingRouter = Router();

weddingRouter
  .route('/')
  .post(createWedding)
  .get(getWeddings)
  .get('/:id', getWeddingById)
  .put('/:id', updateWedding)
  .delete('/:id', deleteWedding);
  ;  


export default weddingRouter;