import {Router} from  'express'

import { protect } from "../middleware/authMiddleware.js";
import upload from  "../middleware/multer.js"
import { createProduct, uploadProductImage,getallProducts,getProductsbyid, updateProducts,deleteProduct, BulkdeleteProduct} from '../controllers/productController.js';

const productRoutes=Router();

productRoutes.post("/upload",upload.array("images", 5),protect, uploadProductImage);
productRoutes.post("/create",protect,createProduct)

// no authentication routes
productRoutes.get('/',getallProducts) // get all products

productRoutes.get('/:id',getProductsbyid) // get  by id 

productRoutes.put('/:id',updateProducts)

productRoutes.delete('/:id',deleteProduct)

productRoutes.delete('/deleteMultiple',BulkdeleteProduct)
export default productRoutes