import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema(
  {
    Username: { type: String, required: true },
    image:{type: String, default:''},
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  },
  { timestamps: true }
);

const ReviewModel= mongoose.model('review',reviewSchema)

export default ReviewModel
