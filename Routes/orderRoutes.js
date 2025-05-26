import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

import { deleteOrder,updateOrder,getOrderById,getAllOrders,createOrder,getOrdersByUser } from '../controllers/orderControllers.js';
const OrderRouter = express.Router();

// Create a new order
OrderRouter.post('/create', protect, createOrder);

// GET /api/orders/user/:userId
OrderRouter.get('/user/:userId', protect, getOrdersByUser);



// Get all orders (admin or user-specific logic can be added later)
OrderRouter.get('/', protect, getAllOrders);

// Get single order by ID
OrderRouter.get('/:id', protect, getOrderById);

// Update an order
OrderRouter.put('/:id', protect, updateOrder);

// Delete an order
OrderRouter.delete('/:id', protect, deleteOrder);

// // routes/orderRoutes.js
// OrderRouter.post("/razorpay", protect, createRazorpayOrder);

export default OrderRouter;
