import Usermodel from "../Models/userModels.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sendEmail from "../config/sendEmail.js";
import crypto from "crypto";

dotenv.config();




// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "100d", 
  });
};



//  Register new user
// route POST /api/users/register

export const registerUser = async (req, res) => {
  try {
    console.log(" Request received:", req.body);

    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await Usermodel.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    console.log(" Plain Password before save:", password);

    // Create new user (Mongoose will hash password in pre-save hook)
    const user = await Usermodel.create({
      name,
      email,
      password, 
    });

    console.log("User created successfully:", { id: user.id, email: user.email });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Server Error" });
  }
};




// Login user & get token
// route POST /api/users/login

export const loginUser = async (req, res) => {
  try {
    console.log("Received login request:", req.body);

    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      console.warn(" Missing email or password");
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await Usermodel.findOne({ email });

    if (!user) {
      console.warn("User not found for email:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log(" User found:", { id: user.id, email: user.email });

    // Debugging password comparison
    console.log("Entered Password:", password);
    console.log("Stored Hashed Password:", user.password);

    // Compare entered password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);

    console.log(" Password Match Result:", isMatch);

    if (!isMatch) {
      console.warn("Password did not match for user:", user.email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log(" Login successful for user:", user.email);

    // Send response with user details and token
    return res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    });

  } catch (error) {
    console.error(" Login Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

//  Get user profile
// route GET /api/users/profile

export const getUserProfile = async (req, res) => {
  try {
    const user = await Usermodel.findById(req.user.id).select("-password"); // Exclude password

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};



//  Update user profile
//  PUT /api/users/profile
// access Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await Usermodel.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        token: generateToken(updatedUser.id),
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};




//Forgot Password Controller
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Usermodel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate a random 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    user.forget_password_otp = otp;
    user.forget_password_expiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    await user.save();

    // Send OTP via email
    await sendEmail(user.email, "Password Reset OTP", `Your OTP is ${otp}`);

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await Usermodel.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if OTP is valid and not expired
    if (
      !user.forget_password_otp ||
      user.forget_password_expiry < Date.now() ||
      user.forget_password_otp !== otp
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and reset OTP fields
    user.password = hashedPassword;
    user.forget_password_otp = null;
    user.forget_password_expiry = null;

    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

