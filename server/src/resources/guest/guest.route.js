import express from 'express';
import * as guestController from './guest.controller.js';

const guestRouter = express.Router();

// Create a new guest
guestRouter.post('/', guestController.createGuest);

// Get guests for a specific wedding (pass weddingId as query param)
guestRouter.get('/', guestController.getGuests);

// Operations on individual guests
guestRouter.get('/:id', guestController.getGuestById);
guestRouter.put('/:id', guestController.updateGuest);
guestRouter.delete('/:id', guestController.deleteGuest);

export default guestrouter;
