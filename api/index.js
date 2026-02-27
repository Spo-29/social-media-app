import express from "express";
import { db } from "./connect.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";

const app = express();

//middlewares
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);
app.use(cookieParser());

// LOGGING MIDDLEWARE - MUST SEE THIS FOR EVERY REQUEST
app.use((req, res, next) => {
  console.log("========================================");
  console.log(`REQUEST: ${req.method} ${req.url}`);
  console.log("BODY:", req.body);
  console.log("========================================");
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);

app.listen(8800, async () => {
  console.log("========================================");
  console.log("🚀 SERVER IS RUNNING ON http://localhost:8800");
  console.log("========================================");

  try {
    await db.pool;
    console.log("✅ Database connected successfully!");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }
});
