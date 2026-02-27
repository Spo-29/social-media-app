import { db } from "../connect.js";

export const getPosts = (req, res) => {
  const q = "SELECT * FROM posts";

  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const addPost = (req, res) => {
  // TODO: Implement add post functionality
  res.status(200).json("Add post endpoint");
};

export const deletePost = (req, res) => {
  // TODO: Implement delete post functionality
  res.status(200).json("Delete post endpoint");
};
