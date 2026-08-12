# Chat AI

**Chat AI** is a modern chat application built using the MERN stack (MongoDB, Express.js, React, and Node.js). It integrates Google Gemini for AI replies, Auth0 for authentication, React Query for server state, and ImageKit for image uploads.

## Features

- Image uploads and rendering in chat
- Recent chat history management
- Streaming AI responses via Google Gemini
- User authentication with Auth0
- Data fetching/caching with React Query

## Project structure

```
Chat-AI/
  client/   # Vite + React frontend
  backend/  # Express + MongoDB API
```

## Prerequisites

- Node.js 20+ (Node 22/24 also works)
- MongoDB connection string
- Auth0 application + API
- ImageKit account
- Google Gemini API key

## Setup

1. Clone the repo and install dependencies **in each package** (there is no root `package.json`):

```bash
cd client
npm install

cd ../backend
npm install
```

2. Copy env templates and fill in real values:

```bash
cp client/.env.example client/.env
cp backend/.env.example backend/.env
```

3. Run the apps in two terminals:

```bash
# terminal 1
cd backend
npm run dev

# terminal 2
cd client
npm run dev
```

- Frontend: `http://localhost:5173` (or whatever Vite prints)
- Backend: uses `PORT` from `backend/.env`

## Notes

- Always run npm scripts from `client/` or `backend/`, not the repo root.
- Gemini model is configured in `client/src/lib/gemini.js` (currently `gemini-3.5-flash-lite`).
- `npm start` / `npm run dev` in the backend both load `.env` via Node's `--env-file`.
