import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getComments = async (req, res) => {
  try {
    const q =
      "SELECT c.*, u.name, u.profilePic FROM comments AS c JOIN users AS u ON (u.id = c.userId) WHERE c.postId = ? ORDER BY c.createdAt DESC";
    const data = await db.query(q, [req.query.postId]);
    return res.status(200).json(data.recordset);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const addComment = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    if (!req.body.desc || !req.body.postId) {
      return res.status(400).json("Comment text and postId are required.");
    }

    const q =
      "INSERT INTO comments ([desc], createdAt, userId, postId) VALUES (?, DATEADD(HOUR, -6, GETDATE()), ?, ?)";
    const values = [req.body.desc, userInfo.id, req.body.postId];

    try {
      await db.query(q, values);
      return res.status(200).json("Comment has been created.");
    } catch (dbErr) {
      return res.status(500).json(dbErr);
    }
  });
};
