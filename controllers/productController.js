import ProductModel from "../Models/productModels.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Upload Image to Cloudinary 
export async function uploadProductImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "products",
      user_filename: true,
      unique_filename: false,
      overwrite: false,
    });

    // Delete file from local storage
    fs.unlinkSync(req.file.path);

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: result.secure_url, // Image URL is returned
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: error.message,
    });
  }
}

  
  //create product
  export async function createProduct(req,res) {
    try {
        const {
            name, description,images, // Array of image URLs
            brand,price,oldPrice,catId,subcatId,thirdsubCatid,
            countInstock,discount,productRam,size,
            productWeight,location,category
          } = req.body;

          // Create new product
    const newProduct = new ProductModel({
        name,
        description,
        images, //Stores an array of image URLs
        brand,
        price,
        oldPrice,
        catId,
        subcatId,
        thirdsubCatid,
        countInstock,
        discount,
        productRam,
        size,
        productWeight,
        location,
        category
        

      });
await newProduct.save()
         
return res.status(200).json({
    success:true,
    message:'the product is created successfully',
    product:newProduct
})

    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({
          message: error.message || "Internal Server Error",
          success: false,
        });
        
    }
    
  }
