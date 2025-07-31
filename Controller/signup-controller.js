const db = require("../Connection/connection");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const SECRET_KEY = process.env.SECRET_KEY;

const register = async (req, res) => {
  try {
    const { username, password, displayusername, timestamp } = req.body;

    if (!username || !password || !displayusername || !timestamp) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const [existing] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: "Username already exists." });
    }

    // const hashedPassword = await bcrypt.hash(password, 10); -> 60
    const timestampDate = new Date(timestamp);

    await db.query(
      `INSERT INTO users (username, password, display_username, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)`,
      [username, password, displayusername, timestampDate, timestampDate]
    );

    const [userRows] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    const user = userRows[0];
    const userId = user.user_id;

    const tokenPayload = {
      sid: uuidv4(), // session ID
      user_id: userId, // user ID from DB
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // expires in 1 hour
      ctd: timestamp, // created timestamp from client
    };

    const token = jwt.sign(tokenPayload, SECRET_KEY);

    res.status(201).json({
      token,
      displayusername: user.display_username,
      userid: userId,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(403).json({ errors: "Failed" });
  }
};

module.exports = register;
