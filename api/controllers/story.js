import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getStories = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = `
      SELECT s.id, s.img, s.userId, u.name
      FROM stories AS s
      JOIN users AS u ON (u.id = s.userId)
      WHERE s.userId = ?
         OR EXISTS (
           SELECT 1
           FROM relationships AS r
           WHERE r.followerUserId = ?
             AND r.followedUserId = s.userId
         )
      ORDER BY s.id DESC
    `;

    try {
      const data = await db.query(q, [userInfo.id, userInfo.id]);
      return res.status(200).json(data.recordset);
    } catch (dbErr) {
      return res.status(500).json(dbErr);
    }
  });
};

export const addStory = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    if (!req.body.img) {
      return res.status(400).json("Story image is required.");
    }

    const q = "INSERT INTO stories (img, userId) VALUES (?, ?)";

    try {
      await db.query(q, [req.body.img, userInfo.id]);
      return res.status(200).json("Story has been created.");
    } catch (dbErr) {
      return res.status(500).json(dbErr);
    }
  });
};

export const deleteStory = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const storyId = req.params.id;

    try {
      const existing = await db.query("SELECT userId FROM stories WHERE id = ?", [
        storyId,
      ]);

      if (!existing.recordset.length) {
        return res.status(404).json("Story not found.");
      }

      if (Number(existing.recordset[0].userId) !== Number(userInfo.id)) {
        return res.status(403).json("You can only delete your own story.");
      }

      await db.query("DELETE FROM stories WHERE id = ?", [storyId]);
      return res.status(200).json("Story has been deleted.");
    } catch (dbErr) {
      return res.status(500).json(dbErr);
    }
  });
};
