// ... existing imports ...
import cors from "cors";

// CORS configuration
const corsOptions = {
  origin: "*", // For development - we'll update this with specific frontend URL later
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// ... rest of your middleware ...

// Update port configuration
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
