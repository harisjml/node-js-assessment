const jwt = require('jsonwebtoken');
const db = require('../Connection/connection');
const SECRET_KEY = process.env.SECRET_KEY;

const verifyToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    const sid = decoded.sid;
    
    const [rows] = await db.query("SELECT * FROM active_tokens WHERE sid = ?", [sid]);
    if (rows.length === 0) {
      return res.status(403).json({ message: 'Token is not active or has been logged out.' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token.' });
  }
};


module.exports =  verifyToken ;
