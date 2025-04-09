import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config.js";

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

// Register a new user
export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ success: false, message: "User already exists" });
      return;
    }

    const user = new User({
      email,
      password,
      name,
    });

    await user.save();

    const token = generateToken(user._id.toString());

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ success: false, message: "Invalid credentials" });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(400).json({ success: false, message: "Invalid credentials" });
      return;
    }

    const token = generateToken(user._id.toString());

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = req.user;

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
