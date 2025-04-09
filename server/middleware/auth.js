import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res
        .status(401)
        .json({ success: false, message: "No token, authorization denied" });
      return;
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Find user by ID
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(401).json({ success: false, message: "User not found" });
      return;
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ success: false, message: "Token is not valid" });
  }
};
