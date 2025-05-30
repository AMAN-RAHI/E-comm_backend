import {Router} from  'express'

import { protect } from "../middleware/authMiddleware.js";
import upload from  "../middleware/multer.js"
import { createProduct, uploadProductImage,getallProducts,getProductsbyid, 
    updateProducts,deleteProduct, BulkdeleteProduct,uploadBannerImage,
    getLatestProducts,getFeaturedProducts,searchProducts} from '../controllers/productController.js';

const productRoutes=Router();

productRoutes.post("/upload",upload.array("images", 5),protect, uploadProductImage);
productRoutes.post("/uploadbannerImage",upload.array("images", 5),protect, uploadBannerImage);
productRoutes.post("/create",protect,createProduct)

// GET /api/products/latest-products
productRoutes.get("/latest-products", getLatestProducts);

// GET /api/products/latest-products
productRoutes.get("/featured-products",getFeaturedProducts);

// no authentication routes
productRoutes.get('/',getallProducts) // get all products

//delete in bulk
productRoutes.delete('/deleteMultiple',BulkdeleteProduct)

//this is search route
productRoutes.get('/search', searchProducts);

productRoutes.get('/:id',getProductsbyid) // get  by id 

productRoutes.put('/:id',updateProducts)

productRoutes.delete('/:id',deleteProduct)





export default productRoutes