const db = require("../Connection/connection");

const logOut = async (req, res) => {
  try {
    const logouttimestamp = req.body.timestamp;
    const sid = req.user.sid;

    await db.query("DELETE FROM active_tokens WHERE sid = ?", [sid]);
    
    return res.status(200).json({ message: "logout success" });
  } catch (err) {
    res.status(403).json({ errors: "Failed" });
  }
};

module.exports = logOut;
