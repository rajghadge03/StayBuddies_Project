import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";





dotenv.config({ path: "./.env" });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // serve uploaded files

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Server start
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
