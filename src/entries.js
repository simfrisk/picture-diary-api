const express = require('express');
const multer  = require('multer');
const db      = require('./db');
const { uploadFile, deleteFile } = require('./storage');
const { requireAuth } = require('./auth');

const router  = express.Router();
const upload  = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

router.use(requireAuth);

// List all entries
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM entries ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get one entry
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM entries WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create entry with photo
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Photo required' });

    const { note, latitude, longitude } = req.body;
    const { key, url } = await uploadFile(req.file.buffer, req.file.mimetype, req.file.originalname);

    const { rows } = await db.query(
      `INSERT INTO entries (photo_url, photo_key, note, latitude, longitude)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [url, key, note || null, latitude || null, longitude || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete entry + photo
router.delete('/:id', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT photo_key FROM entries WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });

    await deleteFile(rows[0].photo_key);
    await db.query('DELETE FROM entries WHERE id = $1', [req.params.id]);
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
