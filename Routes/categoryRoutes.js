import {Router} from  'express'

import { protect } from "../middleware/authMiddleware.js";
import upload from  "../middleware/multer.js"
import {createCategory,getallCategory,getCategoryById,updateCategory,deleteCategory} from "../controllers/categoryControllers.js"


const categoryRouter= Router()

categoryRouter.post("/create", upload.single("image"), createCategory);

// api/category/gettall
categoryRouter.get("/", getallCategory);

//api/category/getby  id 
categoryRouter.get("/:id", getCategoryById);

//api/category/update 
categoryRouter.put("/:id", updateCategory);

//api/category/delete
categoryRouter.delete("/:id", deleteCategory);

export default categoryRouter;
