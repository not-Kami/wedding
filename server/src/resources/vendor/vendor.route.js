import { Router } from 'express';
import { createVendor, getVendor } from './vendor.controller.js';

const vendorRouter = Router();

vendorRouter
  .route('/')
    .get(getVendor)
    .post(createVendor);  

   


export default vendorRouter;