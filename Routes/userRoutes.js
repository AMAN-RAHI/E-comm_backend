import express from "express";
import {
  registerUser, loginUser, getUserProfile,updateUserProfile,forgotPassword,resetPassword,logoutUser} 
  from "../controllers/userControllers.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public Routes (No Authentication Needed)
router.post("/register", registerUser); // Register a new user
router.post("/login", loginUser); // Login user
router.post("/forgot-password", forgotPassword); // Send OTP for Password Reset
router.post("/reset-password", resetPassword);   // Reset Password using OTP

router.post("/logout", logoutUser); // logout route

// Protected Routes (Require Authentication)
router.get("/profile", protect, getUserProfile); // Get user profile
router.put("/profile", protect, updateUserProfile); // Update user profile

// private route need to be checked by the authentication middleware here it is protect 

export default router;
