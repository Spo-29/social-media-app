import { db } from "../connect.js";

export const getUser = (req, res) => {
  const userId = req.params.userId;
  const q = "SELECT * FROM users WHERE id = @userId";

  db.query(q, { userId }, (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...info } = data[0];
    return res.json(info);
  });
};

export const updateUser = (req, res) => {
  // TODO: Implement update user functionality
  res.status(200).json("User update endpoint");
};
