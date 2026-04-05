import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getUser = async (req, res) => {
  const userId = req.params.userId;
  const q = "SELECT * FROM users WHERE id = ?";

  try {
    const data = await db.query(q, [userId]);

    if (!data.recordset.length) {
      return res.status(404).json("User not found.");
    }

    const { password, ...info } = data.recordset[0];
    return res.status(200).json(info);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    if (!req.body.username || !req.body.name) {
      return res.status(400).json("Username and name are required.");
    }

    if (req.body.website && !req.body.website.includes(".")) {
      return res.status(400).json("Website should be a valid domain.");
    }

    const q =
      "UPDATE users SET username = ?, name = ?, city = ?, website = ?, profilePic = ?, coverPic = ? WHERE id = ?";

    try {
      const currentUserData = await db.query("SELECT * FROM users WHERE id = ?", [
        userInfo.id,
      ]);

      if (!currentUserData.recordset.length) {
        return res.status(404).json("User not found.");
      }

      const previousUser = currentUserData.recordset[0];

      const existing = await db.query("SELECT id FROM users WHERE username = ? AND id <> ?", [
        req.body.username,
        userInfo.id,
      ]);

      if (existing.recordset.length) {
        return res.status(409).json("Username already exists!");
      }

      const values = [
        req.body.username,
        req.body.name,
        req.body.city ?? null,
        req.body.website ?? null,
        req.body.profilePic ?? null,
        req.body.coverPic ?? null,
        userInfo.id,
      ];

      await db.query(q, values);

      if (req.body.profilePic && req.body.profilePic !== previousUser.profilePic) {
        await db.query(
          "INSERT INTO posts ([desc], img, createdAt, userId) VALUES (?, ?, DATEADD(HOUR, -6, GETDATE()), ?)",
          ["Updated profile picture", req.body.profilePic, userInfo.id],
        );
      }

      if (req.body.coverPic && req.body.coverPic !== previousUser.coverPic) {
        await db.query(
          "INSERT INTO posts ([desc], img, createdAt, userId) VALUES (?, ?, DATEADD(HOUR, -6, GETDATE()), ?)",
          ["Updated cover picture", req.body.coverPic, userInfo.id],
        );
      }

      const updatedUser = await db.query("SELECT * FROM users WHERE id = ?", [
        userInfo.id,
      ]);

      const { password, ...info } = updatedUser.recordset[0];
      return res.status(200).json(info);
    } catch (dbErr) {
      return res.status(500).json(dbErr);
    }
  });
};
