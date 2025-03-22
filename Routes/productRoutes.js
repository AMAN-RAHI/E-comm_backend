import {Router} from  'express'

import { protect } from "../middleware/authMiddleware.js";
import upload from  "../middleware/multer.js"
import { createProduct, uploadProductImage } from '../controllers/productController.js';

const productRoutes=Router();

productRoutes.post("/upload",  upload.single("image",5),protect, uploadProductImage);
productRoutes.post("/create",protect,createProduct)

export default productRoutes