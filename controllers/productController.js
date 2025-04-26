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
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const urls = [];

    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "products",
        user_filename: true,
        unique_filename: false,
        overwrite: false,
      });

      urls.push(result.secure_url);
      fs.unlinkSync(file.path); // clean up local file
    }

    return res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      imageUrls: urls,
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

  //get all products
  export async function getallProducts(req,res) {
    try {
      const products= await ProductModel.find()

      if(products.length ===0) return res.status(404).json({
        success:false,
        message:'the product is not  found'
      })

      res.status(200).json({success:true,message:"product is found successfully",products})

      
    } catch (error) {
      console.error("Server Error:", error);
      return res.status(500).json({
        message: error.message || "Internal Server Error",
        success: false,
      });
    }
    
  }

  //get products by id
   export async function getProductsbyid(req,res) {
    try {
      const product = await ProductModel.findById(req.params.id)

      if(!product) return res.status(404).json({
        success:false,
        message : 'the product is not found'
      })

      res.status(200).json({
        success :true,
        message:'the product is found successfully',
        product

      })
      
    } catch (error) {
      console.error("Server Error:", error);
      return res.status(500).json({
        message: error.message || "Internal Server Error",
        success: false,
      });
      
    }
    
   }

   //update the product
   export async function updateProducts(req,res) {
    try {
      const updateproduct =await ProductModel.findByIdAndUpdate(req.params.id,
        {$set:req.body},
        {new:true, runValidators:true}
      )

      if(!updateproduct) return res.status(404).json({
        success:false,
        message :'the product is not found'
      })

      res.status(200).json({
        success:true,
        message:'the product is updated successfully',
        product:updateproduct
      })
      
    } catch (error) {
      console.error("Server Error:", error);
      return res.status(500).json({
        message: error.message || "Internal Server Error",
        success: false,
      });
    }
    
   }

   //delete function for products
   export async function deleteProduct(req,res) {
    try {
      const product = await ProductModel.findById(req.params.id)

      if(!product) return res.status(404).json({
        success:false,
        message :'product is not found'

      })

      // lets delete image from cloudinnary as well if present there
      if (product.images?.length > 0) {
        const deletePromises = product.images.map((imageUrl) => {
          const publicId = imageUrl.split("/").pop().split(".")[0];
          return cloudinary.uploader.destroy(publicId); // ✅ Use cloudinary.uploader.destroy()
        });
      
        await Promise.all(deletePromises); // Deletes all images in parallel
      }
      

      //delete the product from mongodb
      await ProductModel.findByIdAndDelete(req.params.id)
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