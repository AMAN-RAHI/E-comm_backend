import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim : true
  },

  image: {
    type: String,
    },

    parent_category_name: {
    type: String,
    },

  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Category',
    default:null
  },
}, { timestamps: true }); // Auto-adds createdAt & updatedAt fields

const CategoryModel = mongoose.model("Category", categorySchema );
export default CategoryModel;
