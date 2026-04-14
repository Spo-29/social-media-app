import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getLikes = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  try {
    const q = "SELECT userId FROM likes WHERE postId = ?";
    const data = await db.query(q, [req.query.postId]);
    return res.status(200).json(data.recordset.map((like) => like.userId));
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const addLike = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    if (!req.body.postId) {
      return res.status(400).json("postId is required.");
    }

    try {
      const checkQuery = "SELECT id FROM likes WHERE userId = ? AND postId = ?";
      const existing = await db.query(checkQuery, [userInfo.id, req.body.postId]);

      if (existing.recordset.length) {
        return res.status(200).json("Post already liked.");
      }

      const q = "INSERT INTO likes (userId, postId) VALUES (?, ?)";
      await db.query(q, [userInfo.id, req.body.postId]);

      return res.status(200).json("Post has been liked.");
    } catch (dbErr) {
      return res.status(500).json(dbErr);
    }
  });
};

export const deleteLike = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    if (!req.query.postId) {
      return res.status(400).json("postId is required.");
    }

    try {
      const checkQuery = "SELECT id FROM likes WHERE userId = ? AND postId = ?";
      const existing = await db.query(checkQuery, [userInfo.id, req.query.postId]);

      if (!existing.recordset.length) {
        return res.status(200).json("Post not liked yet.");
      }

      const q = "DELETE FROM likes WHERE userId = ? AND postId = ?";
      await db.query(q, [userInfo.id, req.query.postId]);

      return res.status(200).json("Post has been unliked.");
    } catch (dbErr) {
      return res.status(500).json(dbErr);
    }
  });
};
