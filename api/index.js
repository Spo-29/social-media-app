import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import storiesRoutes from "./routes/stories.js";

const app = express();

// Middlewares
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000", // Matches the port in your screenshot
  })
);

app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/stories", storiesRoutes);

// Test routes
app.get("/", (req, res) => {
  res.send("API is working 🚀");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from backend!" });
});

// Server listener
const PORT = 8800;
app.listen(PORT, () => {
  console.log(`Server is officially listening on port ${PORT}...`);
  console.log("Press Ctrl+C to stop the server.");
});