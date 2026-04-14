const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

router.post('/login', async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'Password required' });

  const valid = password === process.env.DIARY_PASSWORD;
  if (!valid) return res.status(401).json({ error: 'Invalid password' });

  const token = jwt.sign({ sub: 'simon' }, process.env.JWT_SECRET, { expiresIn: '90d' });
  res.json({ token });
});

function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { router, requireAuth };
