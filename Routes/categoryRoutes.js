import {Router} from  'express'

import { protect } from "../middleware/authMiddleware.js";
import upload from  "../middleware/multer.js"
import {createCategory} from "../controllers/categoryControllers.js"


const categoryRouter= Router()

categoryRouter.post("/create", upload.single("image"), createCategory);

export default categoryRouter;
