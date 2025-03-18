import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true, // Ensures order ID is unique
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User", // Reference to User model
    required: true,
  },
  productId: [{
    type: mongoose.Schema.ObjectId,
    ref: "Product", // Reference to Product model
    required: true,
  }],
  product_details: [{
    name: String,
    price: Number,
    quantity: Number,
  }],
  paymentId: {
    type: String, // Stores payment transaction ID (from Stripe, Razorpay, etc.)
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Completed", "Failed", "Refunded"],
    default: "Pending",
  },
  deliveryAddress: {
    type: mongoose.Schema.ObjectId,
    ref: "Address", // Links to Address model
    required: true,
  },
  subtotalAmt: {
    type: Number,
    required: true,
  },
  totalAmt: {
    type: Number,
    required: true,
  },
  invoiceReceipt: {
    type: String, // URL or filename of invoice receipt
    default: "",
  },
}, { timestamps: true }); // Auto-adds createdAt & updatedAt fields

const OrderModel = mongoose.model("Order", orderSchema);
export default OrderModel;
