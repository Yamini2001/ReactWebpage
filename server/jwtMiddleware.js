const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Decode token without verifying to get the role
    const decodedHeader = jwt.decode(token);

    if (!decodedHeader || !decodedHeader.role) {
      return res.status(403).json({ message: 'Invalid token structure' });
    }

    const role = decodedHeader.role;

    // Map roles to env secrets
    const roleSecretMap = {
      admin: process.env.JWT_SECRET_ADMIN,
      supervisor_mahendergarh: process.env.JWT_SECRET_SUPERVISOR_MAHENDERGARH,
      supervisor_narnaul: process.env.JWT_SECRET_SUPERVISOR_NARNAUL,
      supervisor_rewari: process.env.JWT_SECRET_SUPERVISOR_REWARI,
    };

    const secret = roleSecretMap[role];

    if (!secret) {
      return res.status(403).json({ message: 'Invalid role for token verification' });
    }

    // Now verify with correct secret
    const verified = jwt.verify(token, secret);
    req.user = verified;

    return next(); // Token is valid
  } catch (err) {
    console.error('Token verification failed:', err);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
}

module.exports = { verifyToken };
