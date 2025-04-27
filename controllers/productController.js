import ProductModel from "../Models/productModels.js";
import CategoryModel from "../Models/categoryModels.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { error } from "console";

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
            productWeight,location,category,      
          } = req.body;


          // Fetch Category Name
    const cat = await CategoryModel.findById(catId);
    const catName = cat ? cat.name : '';

    //Fetch SubCategory Name
    const subcat = await CategoryModel.findById(subcatId);
    const subcatName = subcat ? subcat.name : '';

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
        category,
        catName,      
        subcatName, 
        

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

      res.status(200).json({success:true,message:"product is found successfully",
        rootProducts:products})

      
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
          return cloudinary.uploader.destroy(publicId); 
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

   //delete products in bulk
   export async  function BulkdeleteProduct(req,res){
    const {ids} =req.body;

    if(!ids || !Array.isArray(ids) || ids.length === 0){
      return res.status(400).json({
        error:true,
        success:false,
        message:'Invalid Input'
      })
    }
    for(let i=0; i<ids.length; i++){
     const product = await ProductModel.findById(ids[i]);

     const images = product.images;
     let img=""

     for(img of images){
      const imgUrl=img;
      const urlArr= imgUrl.split('/')
      const image=urlArr[urlArr.length-1];

      const imageName=image.split(".")[0];

      if(imageName){
        cloudinary.uploader.destroy(imageName,(error,result))
      }
     }
    }

    try {
     await ProductModel.deleteMany({_id:{$in:ids}});
     return res.status(200).json({
      success:true,
      error:false,
      message:'Product deleted successfully'
     })
    } catch (error) {
      return res.status(500).json({
        error:true,
        success:false,
        message:error.message||error
      })
    }
   }