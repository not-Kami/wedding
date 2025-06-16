import { Router } from 'express';
import { createGuest, getGuests, getGuestById, updateGuest, deleteGuest } from './guest.controller.js';

const guestRouter = Router();

guestRouter
  .route('/')
  .get(getGuests)
  .post(createGuest);

guestRouter
  .route('/:id')
  .get(getGuestById)
  .put(updateGuest)
  .delete(deleteGuest);

export default guestRouter;