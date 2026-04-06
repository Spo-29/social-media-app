import { db } from "../connect.js";

export const getStories = async (req, res) => {
  const userId = req.query.userId;
  const q = `
    SELECT s.*, u.username, u.profilePic 
    FROM stories AS s 
    JOIN users AS u ON (u.id = s.userId)
    LEFT JOIN relationships AS r ON (s.userId = r.followedUserId AND r.followerUserId = ?)
    WHERE r.followerUserId IS NOT NULL OR s.userId = ?
    ORDER BY s.createdAt DESC
  `;

  try {
    const data = await db.query(q, [userId, userId]);
    return res.status(200).json(data.recordset);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const addStory = async (req, res) => {
  const q = "INSERT INTO stories (img, userId, createdAt, expireAt) VALUES (?, ?, GETDATE(), DATEADD(hour, 24, GETDATE()))";

  try {
    await db.query(q, [req.body.img, req.body.userId]);
    return res.status(200).json("Story has been created.");
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const deleteStory = async (req, res) => {
  const q = "DELETE FROM stories WHERE id = ? AND userId = ?";

  try {
    await db.query(q, [req.params.id, req.query.userId]);
    return res.status(200).json("Story has been deleted.");
  } catch (err) {
    return res.status(500).json(err);
  }
};