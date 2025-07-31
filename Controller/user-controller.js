const db = require("../Connection/connection");

const getProfile = async (req, res) => {
  try {
    const userId = req.user.user_id; // from authentication.js decoded token
    const timestamp = req.body.timestamp; 

    const [rows] = await db.query(
      "SELECT user_id, username, display_username FROM users WHERE user_id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];

    res.status(200).json({
      username: user.username,
      displayusername: user.display_username,
      userid: user.user_id
    });

  } catch (error) {
    console.error("Get profile error:", error);
    res.status(403).json({ errors: "Failed" });
  }
};

const updateProfile = async (req, res) =>{
  try{
    const {displayusername, timestamp} = req.body;
    const userid = req.user.user_id;

    if (!displayusername || !timestamp) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const formattedTimestamp = new Date(timestamp).toISOString().slice(0, 19).replace('T', ' ');
    const [result] = await db.query(
      "UPDATE users SET display_username = ?, updated_at = ? WHERE user_id = ?",
      [displayusername, formattedTimestamp, userid]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found or not updated" });
    }

    const [rows] = await db.query("SELECT * FROM users where user_id =?",
      [userid]
    );

    const user = rows[0];

    res.status(200).json({
      username: user.username,
      displayusername: user.display_username,
      userid: user.user_id
    })

  }catch(error){
    console.log(`error here : ${error}`);
    res.status(403).json({ errors: "Failed" });
  }
}


module.exports = {getProfile, updateProfile};
