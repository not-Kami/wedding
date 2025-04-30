import { Router } from 'express';


const guestRouter = Router();

guestRouter
  .route('/')
  .get(getGuest)
  .post(createGuest);  

  guestRouter
  .route('/:id')
    .get(getGuestById)
    .post(updateGuestById)
   


export default guestRouter;