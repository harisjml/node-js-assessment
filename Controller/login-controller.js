const db = require("../Connection/connection");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const SECRET_KEY = process.env.SECRET_KEY;

const login = async (req, res) => {
  try {
    const { username, password, timestamp } = req.body;
    if (!username || !password || !timestamp) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const [rows] = await db.query("SELECT * FROM users WHERE username = ? AND password = ?", [username, password]);
    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const user = rows[0];
    const userId = user.user_id;

    // Generate new token
    const sid = uuidv4();
    const exp = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour expiry
    const tokenPayload = {
      sid,
      user_id: userId,
      exp,
      ctd: timestamp,
    };
    const token = jwt.sign(tokenPayload, SECRET_KEY);

    await db.query("DELETE FROM active_tokens WHERE user_id = ?", [userId]);

    await db.query("INSERT INTO active_tokens (sid, user_id, exp) VALUES (?, ?, ?)", [sid, userId, exp]);

    res.status(200).json({
      token,
      displayusername: user.display_username,
      userid: userId,
    });

  } catch (error) {
    console.log(`Login error: ${error}`);
    res.status(403).json({ errors: "Failed" });
  }
};


module.exports = login;
