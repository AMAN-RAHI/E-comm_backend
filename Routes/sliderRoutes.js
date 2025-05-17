import {Router} from  'express'

import { protect } from "../middleware/authMiddleware.js";
import upload from  "../middleware/multer.js"
import { addHomeSlider,getallSlides,getSlidesbyid,updateSlides,deleteSlide,uploadSliderImage } from '../controllers/sliderController.js';
const SliderRoutes = Router();

// Upload Slider Image (e.g., to Cloudinary)
SliderRoutes.post("/upload", upload.array("images", 5), protect, uploadSliderImage);

// Create a new slider (expects image URLs in body)
SliderRoutes.post("/create", protect, addHomeSlider);

// Public - Get all slides
SliderRoutes.get("/", getallSlides);

// Public - Get a single slide by ID
SliderRoutes.get("/:id", getSlidesbyid);

//  Update slide (pass new image if needed)
SliderRoutes.put("/:id", protect, updateSlides);

//  Delete a slide (also deletes from Cloudinary)
SliderRoutes.delete("/:id", protect, deleteSlide);

export default SliderRoutes;