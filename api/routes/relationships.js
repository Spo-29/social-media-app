import express from "express";
import {
  getFollowings,
  getFollowers,
  followUser,
  unfollowUser,
  checkFollowStatus,
} from "../controllers/relationship.js";

const router = express.Router();

// Get users that a specific user is following
router.get("/followings/:userId", getFollowings);

// Get users that are following a specific user
router.get("/followers/:userId", getFollowers);

// Check if logged-in user is following a specific user
router.get("/check/:userId", checkFollowStatus);

// Follow a user
router.post("/follow", followUser);

// Unfollow a user
router.delete("/unfollow", unfollowUser);

export default router;
