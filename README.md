# Counting Reel - One Command Start

## First time setup

Run this once from project root:

```bash
npm run install:all
```

## Start full stack with one command

From project root:

```bash
npm run dev
```

This command:

- ensures `backend/.env` and `frontend/.env` exist (copied from `.env.example` if missing)
- starts backend and frontend in parallel
- prints logs with `[backend]` and `[frontend]` prefixes

## Important for backend mock mode

If backend uses `REEL_ADAPTER=mock`, set `SAMPLE_VIDEO_PATH` in `backend/.env` to a local `.mp4` file.
