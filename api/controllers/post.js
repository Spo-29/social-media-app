import jwt from "jsonwebtoken";
import moment from "moment";
import sql from "mssql";
import { db } from "../connect.js";

export const getPosts = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    try {
      const result = await db
        .request()
        .input("userId1", sql.Int, userInfo.id)
        .input("userId2", sql.Int, userInfo.id)
        .query(`
          SELECT 
            p.*, 
            u.id AS userId, 
            u.name, 
            u.profilePic
          FROM posts AS p
          JOIN users AS u ON u.id = p.userId
          LEFT JOIN relationships AS r ON p.userId = r.followedUserId
          WHERE r.followerUserId = @userId1 OR p.userId = @userId2
          ORDER BY p.createdAt DESC
        `);

      return res.status(200).json(result.recordset);
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

    try {
      await db
        .request()
        .input("desc", sql.VarChar, req.body.desc)
        .input("img", sql.VarChar, req.body.img)
        .input(
          "createdAt",
          sql.DateTime,
          moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
        )
        .input("userId", sql.Int, userInfo.id)
        .query(`
          INSERT INTO posts ([desc], [img], [createdAt], [userId])
          VALUES (@desc, @img, @createdAt, @userId)
        `);

      return res.status(200).json("Post has been created.");
    } catch (err) {
      return res.status(500).json(err);
    }
  });
};