import jwt from "jsonwebtoken";
import Usermodel from "../Models/userModels.js";
import dotenv from "dotenv";

dotenv.config(); // Ensure environment variables are loaded

export const protect = async (req, res, next) => {
  try {
    console.log("🔹 Request Headers:", req.headers);

    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = req.headers.authorization.split(" ")[1]?.trim(); // Extract and trim token
    console.log("✅ Extracted Token:", token);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    // Decode token without verifying to inspect payload
    const decodedRaw = jwt.decode(token);
    console.log("🔹 Raw Decoded Token:", decodedRaw);

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔹 Verified Token:", decoded);

    // Fetch the user from DB
    req.user = await Usermodel.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    console.log("✅ User Found:", req.user);
    next(); // Proceed to next middleware
  } catch (error) {
    console.error("❌ Authentication Error:", error.message);
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};
