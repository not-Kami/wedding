import express from 'express';
import * as weddingController from './wedding.controller.js';

const weddingRouter = express.Router();

weddingRouter.post('/', weddingController.createWedding);
weddingRouter.get('/', weddingController.getWeddings);
weddingRouter.get('/:id', weddingController.getWeddingById);
weddingRouter.put('/:id', weddingController.updateWedding);
weddingRouter.delete('/:id', weddingController.deleteWedding);

export default weddingRouter;