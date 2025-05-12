import { Router } from 'express';
import { createGuest, getGuest } from './guest.controller.js';

const guestRouter = Router();

guestRouter
  .route('/')
  .get(getGuest)
  .post(createGuest);  

   
export default guestRouter;