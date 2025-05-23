import express from "express";
import {
  registerUser, loginUser, getUserProfile,updateUserProfile,forgotPassword,resetPassword,logoutUser,
  verifyEmail,verifyforgotpasswordOtp,Uploadavatar,addReview,getReviews} 
  from "../controllers/userControllers.js";

import { protect } from "../middleware/authMiddleware.js";
import uploadAvatar from "../middleware/avatarMulter.js"
import { refreshToken } from "../utils/refreshToken.js";

const router = express.Router();

// Public Routes (No Authentication Needed)
router.post("/register", registerUser); // Register a new user
router.post("/login", loginUser); // Login user
router.post("/forgot-password", forgotPassword); // Send OTP for Password Reset
router.post("/reset-password", resetPassword);   // Reset Password using OTP
router.post("/verify", verifyEmail); // OTP Verification Route
router.post("/verify-forget-password",verifyforgotpasswordOtp)

router.put("/user-avatar", protect, uploadAvatar.single("avatar"), Uploadavatar);

router.post("/refresh-token", refreshToken); 

router.post("/logout", logoutUser); // logout route

// Protected Routes (Require Authentication)
router.get("/profile", protect, getUserProfile); // Get user profile
router.put("/profile", protect, updateUserProfile); // Update user profile

// private route need to be checked by the authentication middleware here it is protect 


router.post("/addReviews",protect,addReview); // review routes
router.get("/getReviews", getReviews); 


export default router;
