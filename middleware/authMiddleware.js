import jwt from "jsonwebtoken";
import Usermodel from "../Models/userModels.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1]; // Get token from header
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token

      req.user = await Usermodel.findById(decoded.id).select("-password"); // Attach user to request object
      next(); // Continue execution
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
