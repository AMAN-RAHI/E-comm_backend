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
    const { name, parent_id } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    let imageUrl = "";

    // Check if an image is uploaded
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "categories",
          user_filename: true,
          unique_filename: false,
          overwrite: false,
        });

        imageUrl = result.secure_url;

        // Delete file from local storage after upload
        fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        console.error("Cloudinary Upload Error:", uploadError);
        return res.status(500).json({
          message: "Cloudinary upload failed",
          error: uploadError.message,
          success: false,
        });
      }
    }

    // Find Parent Category Name (if exists)
    let parent_category_name = "";
    if (parent_id) {
      const parentCategory = await CategoryModel.findById(parent_id);
      if (!parentCategory) {
        return res.status(400).json({ message: "Invalid parent category" });
      }
      parent_category_name = parentCategory.name;
    }

    // Save category in MongoDB
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
    });

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
}
