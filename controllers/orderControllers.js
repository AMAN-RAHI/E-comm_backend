import OrderModel from "../Models/orderModels.js";
import Razorpay from "razorpay";

// CREATE: Place a new order
export const createOrder = async (req, res) => {
  try {
    const {
      orderId,
      userId,
      productId,
      product_details,
      paymentId,
      paymentStatus,
      deliveryAddress,
      subtotalAmt,
      totalAmt,
      invoiceReceipt,
    } = req.body;

    const newOrder = new OrderModel({
      orderId,
      userId,
      productId,
      product_details,
      paymentId,
      paymentStatus,
      deliveryAddress,
      subtotalAmt,
      totalAmt,
      invoiceReceipt,
    });

    await newOrder.save();
    res.status(201).json({ success: true, message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Order creation failed:", error);
    res.status(500).json({ success: false, message: "Failed to create order", error });
  }
};

// READ: Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find()
      .populate("userId", "name email")
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch orders", error });
  }
};

// READ: Get single order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.id)
      .populate("userId", "name email")
      .populate("productId", "name brand")
      .populate("deliveryAddress");

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch order", error });
  }
};

// UPDATE: Update an order (e.g., delivery status, payment status)
export const updateOrder = async (req, res) => {
  try {
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedOrder) return res.status(404).json({ success: false, message: "Order not found" });

    res.status(200).json({ success: true, message: "Order updated successfully", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update order", error });
  }
};

// DELETE: Delete an order
export const deleteOrder = async (req, res) => {
  try {
    const deleted = await OrderModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Order not found" });

    res.status(200).json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete order", error });
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await OrderModel.find({ userId }); // ← remove populate
    res.status(200).json(orders);
  } catch (error) {
    console.error("Order Fetch Error:", error); // log the error
    res.status(500).json({ success: false, message: "Failed to fetch user orders", error });
  }
};


// just keeping it away right now
// // controllers/orderController.js
// const razorpayInstance = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_SECRET,
// });

// export const createRazorpayOrder = async (req, res) => {
//   try {
//     const { totalAmt } = req.body;

//     const options = {
//       amount: totalAmt * 100, // Razorpay expects amount in paisa
//       currency: "INR",
//       receipt: `receipt_order_${Date.now()}`,
//     };

//     const order = await razorpayInstance.orders.create(options);

//     res.status(200).json({ success: true, order });
//   } catch (err) {
//     console.error("Razorpay order error:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

