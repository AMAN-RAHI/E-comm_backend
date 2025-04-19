import CategoryModel from "../Models/categoryModels.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Create Category & Upload Image (Single API Call)
export async function createCategory(req, res) {
  try {
    const { name,image,parent_id  } = req.body;

    console.log("formData in postDataCategory:", req.body);
    
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const imageUrl = image || "";

    let parent_category_name = "";
    if (parent_id) {
      const parentCategory = await CategoryModel.findById(parent_id);
      if (!parentCategory) {
        return res.status(400).json({ message: "Invalid parent category" });
      }
      parent_category_name = parentCategory.name;
    }

    const newCategory = new CategoryModel({
      name,
      parent_id: parent_id || null,
      image: imageUrl,
      parent_category_name,
    });

    await newCategory.save();

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category: newCategory,
      uploadedImages: imageUrl ? [imageUrl] : [],
    });

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
}



// create get all category controller
export async function getallCategory(req,res) {
try {
  const categories =await CategoryModel.find()

  //for sub categories
  const categoryMap={}
  categories.forEach(cat=>{
    
      categoryMap[cat._id]={...cat._doc, children:[]}

    })

    const rootCategories=[]
  categories.forEach(cat=>{
    if(cat.parent_id){
      categoryMap[cat.parent_id].children.push(categoryMap[cat.id])

    }
    else{
      rootCategories.push(categoryMap[cat._id])
    }
  })

  res.status(200).json({success:true, rootCategories})
  
} catch (error) {
  res.status(500).json({success:false,message:error.message})
}
  
}

// create get by id 
export async function getCategoryById(req,res) {
  try {
    const category= await CategoryModel.findById(req.params.id)
    if(!category) return res.status(400).json({success:false, message:'Category not found'})

      res.status(200).json({success:true,category})
    
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
  
}

// update categories
export async function updateCategory(req,res) {
  try {
    console.log("Incoming ID:", req.params.id);
    console.log("Incoming Data:", req.body); // 👈 LOG HERE
    const updatecategory= await CategoryModel.findByIdAndUpdate(
      req.params.id,
      {$set:req.body},
      {new:true, runValidators:true}

    );

    if(!updatecategory) return res.status(400).json({sucess:false,message:'Category not found'})

      res.status(200).json({success:true, message:'Updated Categort',category:updatecategory})
    
  } catch (error) {
    res.status(500).json({success:false,message:error.message})
  }
  
}

// delete categories route
export async function deleteCategory(req,res) {
  try {
    const category= await CategoryModel.findById(req.params.id)

    if(!category) return res.status(500).json({sucess:false, message:'Category not found'})

      // first check wether the subcategory is present or not 
      const hassubCategories = await CategoryModel.exists({parent_id : category._id})

      if(hassubCategories ){
        return res.status(400).json({
          success:false,
          message : 'has a subcategory first delete the subcategory then delete roor category'
        })
      }
      await CategoryModel.findByIdAndDelete(req.params.id)

      res.status(200).json({success:true,message:'the Category is deleted successfully'})

  } catch (error) {
    res.status(500).json({success:false,message: error.message})
  }
  
}


export async function uploadCategoryImage(req, res) {
  try {
    
  
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const file = req.files[0]; 
    

    const result = await cloudinary.uploader.upload(file.path, {
      folder: "categories",
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
