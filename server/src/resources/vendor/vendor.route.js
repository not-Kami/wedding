import { Router } from 'express';
import { createVendor, getVendors, deleteVendor, updateVendor, getVendorById } from './vendor.controller.js';

const vendorRouter = Router();

// Routes pour '/'
vendorRouter
  .route('/')
  .get(getVendors)
  .post(createVendor);

// Routes pour '/:id'
vendorRouter
  .route('/:id')
  .get(getVendorById)
  .put(updateVendor)
  .delete(deleteVendor);

export default vendorRouter;