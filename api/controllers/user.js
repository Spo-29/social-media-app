import { db } from "../connect.js";

export const getUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const q = "SELECT * FROM users WHERE id = ?";
    const data = await db.query(q, [userId]);

    if (!data.recordset.length) {
      return res.status(404).json("User not found");
    }

    const { password, ...info } = data.recordset[0];
    return res.status(200).json(info);
  } catch (err) {
    console.error("GET USER ERROR:", err);
    return res.status(500).json(err.message || err);
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id, name, city, website, profilePic, coverPic } = req.body;

    if (!id) {
      return res.status(400).json("User id is required");
    }

    const q = `
      UPDATE users
      SET name = ?, city = ?, website = ?, profilePic = ?, coverPic = ?
      WHERE id = ?
    `;

    await db.query(q, [name, city, website, profilePic, coverPic, id]);

    return res.status(200).json("User updated successfully");
  } catch (err) {
    console.error("UPDATE USER ERROR:", err);
    return res.status(500).json(err.message || err);
  }
};