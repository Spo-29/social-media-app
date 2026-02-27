import { db } from "../connect.js";

export const getComments = async (req, res) => {
  try {
    const q = "SELECT * FROM comments WHERE postId = ?";
    const data = await db.query(q, [req.query.postId]);
    return res.status(200).json(data.recordset);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const addComment = async (req, res) => {
  // TODO: Implement add comment functionality
  res.status(200).json("Add comment endpoint");
};
