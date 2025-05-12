import { Router } from 'express';
import { createVendor, getVendor } from './vendor.controller.js';

const vendorRouter = Router();

vendorRouter
  .route('/')
    .get(getVendors)
    .post(createVendor)
    .delete('/:id', deleteVendor)
    .put('/:id', updateVendor)
    .get('/:id', getVendorById);
  ;

   


export default vendorRouter;