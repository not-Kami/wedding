import { Router } from 'express';
import { createWedding, getWedding } from './wedding.controller.js';


const weddingRouter = Router();

weddingRouter
  .route('/')
  .post(createWedding)
  .get(getWedding);  

export default weddingRouter;