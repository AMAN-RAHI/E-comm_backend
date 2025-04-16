import jwt from "jsonwebtoken";
import Usermodel from "../Models/userModels.js";
import dotenv from "dotenv";

dotenv.config(); // Ensure environment variables are loaded

export const protect = async (req, res, next) => {
  try {
    console.log("Request Headers:", req.headers);

    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const accessToken = req.headers.authorization.split(" ")[1]?.trim(); // Extract and trim token
    console.log("Extracted Token:", accessToken);

    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized: access Token missing" });
    }

    // Decode token without verifying to inspect payload
    const decodedRaw = jwt.decode(accessToken);
    console.log("Raw Decoded access Token:", decodedRaw);

    // Verify the token
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    console.log("Verified Token:", decoded);
    req.userId = decoded.userId;

    // Fetch the user from DB
    req.user = await Usermodel.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    console.log("User Found:", req.user);
    next(); // Proceed to next middleware

    
  } catch (error) {
    console.error("Authentication Error:", error.message);

    // If token is expired, prompt client to refresh
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired. Please refresh your token." });
    }
   
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};
