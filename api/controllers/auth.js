import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  console.log("Register endpoint hit!");
  console.log("Request body:", req.body);
  
  try {
    // Validate all fields are provided
    if (!req.body.username || !req.body.email || !req.body.password || !req.body.name) {
      return res.status(400).json("Fill in all fields");
    }

    // Validate email pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(req.body.email)) {
      return res.status(400).json("Wrong pattern for email");
    }

    //CHECK USER IF EXISTS
    const q = "SELECT * FROM users WHERE username = ?";
    console.log("Checking if user exists...");
    const data = await db.query(q, [req.body.username]);
    console.log("Query result:", data);

    if (data.recordset.length) {
      return res.status(409).json("User already exists!");
    }

    //CREATE A NEW USER
    //Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const insertQuery =
      "INSERT INTO users (username, email, password, name) VALUES (?, ?, ?, ?)";

    const values = [
      req.body.username,
      req.body.email,
      hashedPassword,
      req.body.name,
    ];

    console.log("Inserting user...");
    await db.query(insertQuery, values);
    console.log("User created successfully!");
    return res.status(200).json("User has been created.");
  } catch (err) {
    console.error("Error in register:", err);
    return res.status(500).json(err);
  }
};

export const login = async (req, res) => {
  console.log("Login endpoint hit!");
  console.log("Request body:", req.body);
  
  try {
    // Validate all fields are provided
    if (!req.body.username || !req.body.password) {
      return res.status(400).json("Fill in all fields");
    }

    const q = "SELECT * FROM users WHERE username = ?";
    console.log("Checking user credentials...");
    const data = await db.query(q, [req.body.username]);
    console.log("Query result:", data);

    if (data.recordset.length === 0) {
      console.log("User not found");
      return res.status(404).json("User not found!");
    }

    console.log("Comparing passwords...");
    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data.recordset[0].password
    );

    if (!checkPassword) {
      console.log("Wrong password");
      return res.status(400).json("Wrong password or username!");
    }

    console.log("Creating token...");
    const token = jwt.sign({ id: data.recordset[0].id }, "secretkey");

    const { password, ...others } = data.recordset[0];

    console.log("Login successful!");
    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  } catch (err) {
    console.error("Error in login:", err);
    return res.status(500).json(err);
  }
};

export const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("User has been logged out.");
};
