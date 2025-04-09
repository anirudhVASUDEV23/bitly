import express from "express";
import cors from "cors";
import { connectDB } from "./db/connection.js";
import { PORT } from "./config.js";
import authRoutes from "./routes/authRoutes.js";
import linkRoutes from "./routes/linkRoutes.js";
import User from "./models/User.js";

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Welcome route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Backend is up and running! You can use the frontend now.",
    frontend: "https://bitly-url-chi.vercel.app/",
    status: "online",
    endpoints: {
      auth: "/api/auth",
      links: "/api/links",
    },
  });
});

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Debug route to see all users (development only)
app.get("/all", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/links", linkRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
