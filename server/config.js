import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// MongoDB configuration
export const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://bitly:bitly@cluster0.wvfea.mongodb.net/bitly-clone";

// Server configuration
export const PORT = process.env.PORT || 4000;

// JWT configuration for authentication
export const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
