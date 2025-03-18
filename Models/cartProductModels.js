import mongoose from "mongoose";

const cartProductSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: "Product", // Reference to Product model
    required: true,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User", // Reference to User model
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
}, { timestamps: true }); // Auto-adds createdAt & updatedAt fields

const CartProductModel = mongoose.model("CartProduct", cartProductSchema);
export default CartProductModel;
