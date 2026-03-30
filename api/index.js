const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("API is working 🚀");
});

// example API route
app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from backend!" });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});