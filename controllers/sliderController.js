import { error } from "console";
import homeSliderModel from "../Models/BannerModel.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";




// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

let imagesArr = [];

// Create Homeslider 
export async function addHomeSlider(req, res) {
  try {
    const { images } = req.body;
if (!images || images.length === 0) {
  return res.status(400).json({ message: "No images provided", success: false });
}

const slide = new homeSliderModel({ images });
const savedSlide = await slide.save();
return res.status(200).json({ message: "Slide created", success: true, slide: savedSlide });


  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
}

 //get all home slides
  export async function getallSlides(req,res) {
    try {
      const slides= await homeSliderModel.find()

     if(!slides){
     return res.status(404).json({
      message: "slides not found",
      success: false,
    });
   }

      return res.status(200).json({
      error:false,
      success: true,
      data:slides
    });

    } catch (error) {
      console.error("Server Error:", error);
      return res.status(500).json({
        message: error.message || "Internal Server Error",
        success: false,
      });
    }
    
  }

   export async function getSlidesbyid(req,res) {
      try {
        const slides = await homeSliderModel.findById(req.params.id)
  
        if(!slides) return res.status(404).json({
          success:false,
          message : 'the slide is not found'
        })
  
        res.status(200).json({
          success :true,
          message:'the slide is found successfully',
          slides
  
        })
        
      } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({
          message: error.message || "Internal Server Error",
          success: false,
        });
        
      }
      
     }

export async function uploadSliderImage(req, res) {
  try {
    
  
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const file = req.files[0]; 
    

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "Sliders",
      user_filename: true,
      unique_filename: false,
      overwrite: false,
    });

    // Clean up local file
    fs.unlinkSync(file.path);

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({
      message: "Image upload failed",
      error: error.message,
      success: false,
    });
  }
}

 export async function deleteSlide(req,res) {
    try {
      const slides = await homeSliderModel.findById(req.params.id)

      if(!slides) return res.status(404).json({
        success:false,
        message :'slides is not found'

      })

      // lets delete image from cloudinnary as well if present there
      if (slides.images?.length > 0) {
        const deletePromises = slides.images.map((imageUrl) => {
          const publicId = imageUrl.split("/").pop().split(".")[0];
          return cloudinary.uploader.destroy(publicId); 
        });
      
        await Promise.all(deletePromises); // Deletes all images in parallel
      }
      

      //delete the product from mongodb
      await homeSliderModel.findByIdAndDelete(req.params.id)
      res.status(200).json({
        success:true,
        message:'the product is deleted successfully'
      })
      
    } catch (error) {
      console.error("Server Error:", error);
      return res.status(500).json({
        message: error.message || "Internal Server Error",
        success: false,
      });
    }
    
   }

    export async function updateSlides(req,res) {
       try {
         const updateslides =await homeSliderModel.findByIdAndUpdate(req.params.id,
          {
            images:imagesArr.length>0 ? imagesArr[0] :req.body.images,
          },
          {new:true}
         )
   
         if(!updateslides) return res.status(404).json({
           success:false,
           message :'the slide is not found'
         })
   
         res.status(200).json({
           success:true,
           message:'the home banner slide is updated successfully',
           slides:updateslides
         })
         
       } catch (error) {
         console.error("Server Error:", error);
         return res.status(500).json({
           message: error.message || "Internal Server Error",
           success: false,
         });
       }
       
      }
