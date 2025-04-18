import {Router} from  'express'

import { protect } from "../middleware/authMiddleware.js";
import upload from  "../middleware/multer.js"
import {createCategory,getallCategory,getCategoryById,updateCategory,deleteCategory, uploadCategoryImage} from "../controllers/categoryControllers.js"


const categoryRouter= Router()

categoryRouter.post("/create",  createCategory);

categoryRouter.post("/upload", upload.array("images", 1), (req, res, next) => {
    console.log("Request body:", req.body);  // Log any other data sent in the body
    console.log("Uploaded files:", req.files);  // Log the uploaded files to check if they are received
    next();  // Proceed to the next handler (uploadCategoryImage)
  }, uploadCategoryImage);

// api/category/gettall
categoryRouter.get("/", getallCategory);

//api/category/getby  id 
categoryRouter.get("/:id", getCategoryById);

//api/category/update 
categoryRouter.put("/:id", updateCategory);

//api/category/delete
categoryRouter.delete("/:id", deleteCategory);


export default categoryRouter;
