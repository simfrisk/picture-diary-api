require('dotenv').config();
const express  = require('express');
const { router: authRouter } = require('./auth');
const entries  = require('./entries');
const { ensureBucket } = require('./storage');
const db       = require('./db');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/auth',    authRouter);
app.use('/entries', entries);

app.get('/health', (_, res) => res.json({ ok: true }));

async function start() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS entries (
      id         SERIAL PRIMARY KEY,
      photo_url  TEXT        NOT NULL,
      photo_key  TEXT        NOT NULL,
      note       TEXT,
      latitude   NUMERIC(10,7),
      longitude  NUMERIC(10,7),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await ensureBucket();
  app.listen(PORT, () => console.log(`Diary API running on port ${PORT}`));
}

start().catch(err => { console.error(err); process.exit(1); });
