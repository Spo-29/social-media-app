import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getPosts = async (req, res) => {
  const userId = req.query.userId;
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    console.log(userId);

    const q =
      userId !== "undefined"
        ? `SELECT p.id, p.[desc], p.img, p.createdAt, p.userId, u.name, u.profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ? ORDER BY p.createdAt DESC`
        : `SELECT p.id, p.[desc], p.img, p.createdAt, p.userId, u.name, u.profilePic
           FROM posts AS p
           JOIN users AS u ON (u.id = p.userId)
           WHERE p.userId = ?
              OR EXISTS (
                SELECT 1
                FROM relationships AS r
                WHERE r.followerUserId = ?
                  AND r.followedUserId = p.userId
              )
           ORDER BY p.createdAt DESC`;

    const values =
      userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id];

    try {
      const data = await db.query(q, values);
      return res.status(200).json(data.recordset);
    } catch (err) {
      return res.status(500).json(err);
    }
  });
};

export const addPost = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO posts ([desc], img, createdAt, userId) VALUES (?, ?, DATEADD(HOUR, -6, GETDATE()), ?)";
    const values = [
      req.body.desc,
      req.body.img,
      userInfo.id,
    ];
 
    try {
      const data = await db.query(q, values);
      return res.status(200).json("Post has been created.");
    } catch (err) {
      return res.status(500).json(err);
    }
  });
};

export const updatePost = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const postId = Number(req.params.id);
    const newDesc = typeof req.body.desc === "string" ? req.body.desc.trim() : "";

    if (!Number.isInteger(postId) || postId <= 0) {
      return res.status(400).json("Invalid post id.");
    }

    if (!newDesc.length) {
      return res.status(400).json("Description is required.");
    }

    try {
      const existing = await db.query("SELECT userId FROM posts WHERE id = ?", [postId]);

      if (!existing.recordset.length) {
        return res.status(404).json("Post not found.");
      }

      if (Number(existing.recordset[0].userId) !== Number(userInfo.id)) {
        return res.status(403).json("You can update only your own posts.");
      }

      await db.query("UPDATE posts SET [desc] = ? WHERE id = ?", [newDesc, postId]);
      return res.status(200).json("Post updated.");
    } catch (dbErr) {
      return res.status(500).json(dbErr);
    }
  });
};

export const deletePost = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const postId = Number(req.params.id);
    if (!Number.isInteger(postId) || postId <= 0) {
      return res.status(400).json("Invalid post id.");
    }

    try {
      const existing = await db.query("SELECT userId FROM posts WHERE id = ?", [postId]);

      if (!existing.recordset.length) {
        return res.status(404).json("Post not found.");
      }

      if (Number(existing.recordset[0].userId) !== Number(userInfo.id)) {
        return res.status(403).json("You can delete only your own posts.");
      }

      await db.query("DELETE FROM posts WHERE id = ?", [postId]);
      return res.status(200).json("Post deleted.");
    } catch (dbErr) {
      return res.status(500).json(dbErr);
    }
  });
};
