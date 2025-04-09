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
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// API Routes
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
  res.json({
    message: "Backend is up and running! You can use the frontend now.",
    frontend: "https://bitly-url-chi.vercel.app/",
    status: "online",
    endpoints: {
      auth: "/api/auth",
      links: "/api/links",
    },
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/links", linkRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.use("/api/auth", authRoutes);
app.use("/api/links", linkRoutes);
app.use("/all", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // hides password
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
