import express from "express";
import { db } from "./connect.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
console.log("INDEX FILE START");
const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json("No file uploaded");
    }

    return res.status(200).json(req.file.filename);
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return res.status(500).json("File upload failed");
  }
});

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