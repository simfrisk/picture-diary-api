require('dotenv').config();

function requireAuth(req, res, next) {
  const deviceId = req.headers['x-device-id'];
  if (!deviceId) return res.status(401).json({ error: 'Missing device ID' });
  req.userId = deviceId;
  next();
}

module.exports = { requireAuth };
