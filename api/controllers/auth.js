import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  console.log("Register endpoint hit!");
  console.log("Request body:", req.body);

  try {
    const { username, email, password, name } = req.body;

    if (!username || !email || !password || !name) {
      return res.status(400).json("Fill in all fields");
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json("Wrong pattern for email");
    }

    console.log("Checking if user exists...");
    const data = await db.query("SELECT * FROM users WHERE username = ?", [username]);
    console.log("Select query done:", data.recordset);

    if (data.recordset.length > 0) {
      return res.status(409).json("User already exists!");
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    console.log("Inserting user...");
    const result = await db.query(
      "INSERT INTO users (username, email, password, name) VALUES (?, ?, ?, ?)",
      [username, email, hashedPassword, name]
    );
    console.log("Insert done:", result);

    return res.status(200).json("User has been created.");
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({
      message: "Register failed",
      error: err.message,
    });
  }
};

export const login = async (req, res) => {
  console.log("Login endpoint hit!");
  console.log("Request body:", req.body);

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json("Fill in all fields");
    }

    const data = await db.query("SELECT * FROM users WHERE username = ?", [username]);
    console.log("Login select done:", data.recordset);

    if (data.recordset.length === 0) {
      return res.status(404).json("User not found!");
    }

    const checkPassword = bcrypt.compareSync(password, data.recordset[0].password);

    if (!checkPassword) {
      return res.status(400).json("Wrong password or username!");
    }

    const token = jwt.sign({ id: data.recordset[0].id }, "secretkey");
    const { password: userPassword, ...others } = data.recordset[0];

    return res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({
      message: "Login failed",
      error: err.message,
    });
  }
};

export const logout = (req, res) => {
  return res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("User has been logged out.");
};