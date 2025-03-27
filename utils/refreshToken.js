import jwt from "jsonwebtoken";
import Usermodel from "../Models/userModels.js";
import dotenv from "dotenv";

dotenv.config();

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(403).json({ message: "Forbidden: No refresh token provided" });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    // Find user in DB
    const user = await Usermodel.findById(decoded.id);
    if (!user) {
      return res.status(403).json({ message: "Forbidden: Invalid refresh token" });
    }

    // Generate a new access token
    const newAccessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" } // Short-lived access token
    );

    res.json({ accessToken: newAccessToken });

  } catch (error) {
    console.error("Refresh Token Error:", error.message);
    return res.status(403).json({ message: "Forbidden: Invalid or expired refresh token" });
  }
};
