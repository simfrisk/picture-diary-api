# Picture Diary API

Express.js backend for the Picture Diary Expo app. Stores diary entries (photo + note + location) using PostgreSQL and MinIO object storage. Designed to run on Liivo.

## Setup

1. Copy `.env.example` to `.env` and fill in values
2. Generate password hash: `node -e "require('bcrypt').hash('yourpassword',10).then(console.log)"`
3. Paste hash into `DIARY_PASSWORD_HASH`

## Run locally
```bash
npm install
npm start
```

## Deploy on Liivo
Point Liivo at this GitHub repo. It builds from the Dockerfile automatically. Set all env vars in the Liivo dashboard.

## Endpoints
- `POST /auth/login` — get JWT token
- `GET /entries` — list entries
- `POST /entries` — create entry (multipart: photo + note + latitude + longitude)
- `GET /entries/:id` — get single entry
- `DELETE /entries/:id` — delete entry + photo
- `GET /health` — health check
