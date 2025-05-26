import { Router } from 'express';
import { createWedding, getWeddings, getWeddingById, updateWedding, deleteWedding } from './wedding.controller.js';

const weddingRouter = Router();

// Routes pour '/'
weddingRouter
  .route('/')
  .post(createWedding)
  .get(getWeddings);

// Routes pour '/:id'
weddingRouter
  .route('/:id')
  .get(getWeddingById)
  .put(updateWedding)
  .delete(deleteWedding);

export default weddingRouter;