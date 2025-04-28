import express from 'express';
import * as weddingController from './wedding.controller.js';

const router = express.Router();

router.post('/', weddingController.createWedding);
router.get('/', weddingController.getWeddings);
router.get('/:id', weddingController.getWeddingById);
router.put('/:id', weddingController.updateWedding);
router.delete('/:id', weddingController.deleteWedding);

export default router;