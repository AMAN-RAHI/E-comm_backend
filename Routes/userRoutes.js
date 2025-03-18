import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Routes (No Authentication Needed)
router.post("/register", registerUser); // Register a new user
router.post("/login", loginUser); // Login user

// Protected Routes (Require Authentication)
router.get("/profile", protect, getUserProfile); // Get user profile
router.put("/profile", protect, updateUserProfile); // Update user profile

export default router;
