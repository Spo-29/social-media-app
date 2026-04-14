import { db } from "../connect.js";
import jwt from "jsonwebtoken";

// Get all users that the logged-in user is following
export const getFollowings = async (req, res) => {
  const userId = Number(req.params.userId);

  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json("Invalid user id.");
  }

  try {
    const result = await db.query(`
      SELECT DISTINCT u.id, u.username, u.name, u.profilePic, u.city
      FROM relationships r
      JOIN users u ON r.followedUserId = u.id
      WHERE r.followerUserId = ?
      ORDER BY u.name ASC
    `, [userId]);

    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get all users that are following the specified user
export const getFollowers = async (req, res) => {
  const userId = Number(req.params.userId);

  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json("Invalid user id.");
  }

  try {
    const result = await db.query(`
      SELECT DISTINCT u.id, u.username, u.name, u.profilePic, u.city
      FROM relationships r
      JOIN users u ON r.followerUserId = u.id
      WHERE r.followedUserId = ?
      ORDER BY u.name ASC
    `, [userId]);

    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Follow a user (create relationship)
export const followUser = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json("Not authenticated!");
  }

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const followerUserId = userInfo.id;
    const followedUserId = Number(req.body.userId);

    if (!Number.isInteger(followedUserId) || followedUserId <= 0) {
      return res.status(400).json("Invalid target user id.");
    }

    // Prevent self-follow
    if (followerUserId === followedUserId) {
      return res.status(400).json("You cannot follow yourself!");
    }

    try {
      const targetUser = await db.query(
        "SELECT id FROM users WHERE id = ?",
        [followedUserId],
      );

      if (!targetUser.recordset.length) {
        return res.status(404).json("User not found!");
      }

      // Check if already following
      const checkResult = await db.query(`
        SELECT * FROM relationships
        WHERE followerUserId = ? AND followedUserId = ?
      `, [followerUserId, followedUserId]);

      if (!checkResult.recordset.length) {
        await db.query(
          "INSERT INTO relationships (followerUserId, followedUserId) VALUES (?, ?)",
          [followerUserId, followedUserId],
        );
      }

      // Keep friendship mutual: ensure reverse direction exists too.
      const reverseCheck = await db.query(`
        SELECT * FROM relationships
        WHERE followerUserId = ? AND followedUserId = ?
      `, [followedUserId, followerUserId]);

      if (!reverseCheck.recordset.length) {
        await db.query(
          "INSERT INTO relationships (followerUserId, followedUserId) VALUES (?, ?)",
          [followedUserId, followerUserId],
        );
      }

      res.status(200).json("Following user!");
    } catch (err) {
      res.status(500).json(err);
    }
  });
};

// Unfollow a user (delete relationship)
export const unfollowUser = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json("Not authenticated!");
  }

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const followerUserId = userInfo.id;
    const followedUserId = Number(req.body.userId);

    if (!Number.isInteger(followedUserId) || followedUserId <= 0) {
      return res.status(400).json("Invalid target user id.");
    }

    try {
      const checkResult = await db.query(`
        SELECT * FROM relationships
        WHERE followerUserId = ? AND followedUserId = ?
      `, [followerUserId, followedUserId]);

      if (checkResult.recordset.length === 0) {
        return res.status(200).json("Not following this user.");
      }

      // Remove both directions to keep friend relation symmetric.
      await db.query(`
        DELETE FROM relationships
        WHERE (followerUserId = ? AND followedUserId = ?)
           OR (followerUserId = ? AND followedUserId = ?)
      `, [followerUserId, followedUserId, followedUserId, followerUserId]);

      res.status(200).json("Unfollowed user!");
    } catch (err) {
      res.status(500).json(err);
    }
  });
};

// Check if logged-in user is following a specific user
export const checkFollowStatus = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json("Not authenticated!");
  }

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const followerUserId = userInfo.id;
    const followedUserId = Number(req.params.userId);

    if (!Number.isInteger(followedUserId) || followedUserId <= 0) {
      return res.status(400).json("Invalid user id.");
    }

    try {
      const result = await db.query(`
        SELECT * FROM relationships
        WHERE followerUserId = ? AND followedUserId = ?
      `, [followerUserId, followedUserId]);

      res.status(200).json(result.recordset.length > 0);
    } catch (err) {
      res.status(500).json(err);
    }
  });
};
