import express from 'express';
import * as bookingController from './booking.controller.js';

const bookingRouter = express.Router();

bookingRouter.post('/', bookingController.createBooking);
bookingRouter.get('/', bookingController.getBookings);
bookingRouter.get('/:id', bookingController.getBookingById);
bookingRouter.put('/:id', bookingController.updateBooking);
bookingRouter.delete('/:id', bookingController.deleteBooking);

export default bookingRouter;
