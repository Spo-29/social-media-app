import { db } from "../connect.js";

export const getLikes = async (req, res) => {
  try {
    const q = "SELECT * FROM likes WHERE postId = ?";
    const data = await db.query(q, [req.query.postId]);
    return res.status(200).json(data.recordset);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const addLike = async (req, res) => {
  // TODO: Implement add like functionality
  res.status(200).json("Add like endpoint");
};

export const deleteLike = async (req, res) => {
  // TODO: Implement delete like functionality
  res.status(200).json("Delete like endpoint");
};
