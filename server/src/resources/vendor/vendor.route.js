import { Router } from 'express';


const vendorRouter = Router();

vendorRouter
  .route('/')
  .get(getVendor)
  .post(createVendor);  

  vendorRouter
  .route('/:id')
    .get(getVendorById)
    .post(updateVendorById)
   


export default vendorRouter;