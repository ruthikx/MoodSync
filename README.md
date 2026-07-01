# MoodSync

MoodSync is a full-stack music listening prototype with role-based auth, artist uploads, album metadata, mood-based browsing, and a React audio player.

## Problem It Solves

Music apps often split discovery, playback, artist publishing, and shared listening into separate flows. This project brings those pieces into one developer-friendly prototype: users can browse and play a catalog, while artists can upload tracks and organize albums. Some social/library features are implemented on the client today, which makes the current code useful as a working product prototype and a clear backend expansion target.

## Key Features

- User and artist registration/login with JWT stored in an HTTP cookie.
- Protected React app with Home, Discover, Playlists, Listening Rooms, and Profile pages.
- MongoDB-backed users, music tracks, and albums through Express/Mongoose models.
- Artist-only track upload endpoint using `multipart/form-data`, `multer`, and ImageKit storage.
- Artist-only album creation from tracks owned by the logged-in artist.
- Audio player with queue playback, play/pause, previous/next, seeking, and listening history tracking.
- Mood filters for `happy`, `sad`, `focus`, and `gym`; mood labels are inferred on the frontend from track data.
- Local likes, listening history, and playlists persisted in `localStorage`.
- Socket.IO client hooks and a listening-room UI that emit room sync events.

## Tech Stack

**Backend**

- Node.js
- Express 5
- MongoDB with Mongoose
- `jsonwebtoken` for JWT auth
- `bcryptjs` for password hashing
- `cookie-parser`
- `multer`
- ImageKit Node SDK (`@imagekit/nodejs`)
- `dotenv`

**Frontend**

- React 18
- React Router
- Vite
- Tailwind CSS with PostCSS and Autoprefixer
- Axios
- Socket.IO Client

## Folder Structure

```text
.
|-- backend/                     # Express API, MongoDB models, auth, music, and album endpoints
|   |-- server.js                # Loads env vars, connects to MongoDB, starts port 3000
|   |-- package.json             # Backend scripts and dependencies
|   `-- src/
|       |-- app.js               # Express app and route mounting
|       |-- controllers/         # Auth and music/album request handlers
|       |-- db/                  # Mongoose connection helper
|       |-- middlewares/         # JWT auth middleware for users/artists
|       |-- models/              # User, music, and album schemas
|       |-- routes/              # `/api/auth` and `/api/music` route definitions
|       `-- services/            # ImageKit upload service
|-- frontend/                    # Vite React client
|   |-- .env.example             # Frontend API/socket defaults
|   |-- index.html               # Vite HTML entry
|   |-- package.json             # Frontend scripts and dependencies
|   `-- src/
|       |-- components/          # Layout, auth form, cards, player, and UI primitives
|       |-- context/             # Auth, music library, and player state providers
|       |-- hooks/               # Local storage and Socket.IO room hooks
|       |-- lib/                 # Constants and formatting/enrichment utilities
|       |-- pages/               # Routed app screens
|       `-- services/            # Axios API, auth, music, library, and socket clients
|-- package.json                 # Root convenience scripts for backend/frontend dev
`-- .gitignore                   # Ignores env files, dependency folders, and frontend builds
```

## Setup & Installation

Prerequisites:

- Node.js and npm. This repo was checked with Node `v20.19.4` and npm `10.8.2`.
- A MongoDB connection string.
- An ImageKit private key for uploading audio files.

Install dependencies from the two lockfiles:

```bash
git clone <repository-url>
cd project
npm ci --prefix backend
npm ci --prefix frontend
```

Create `backend/.env`:

```env
MONGO_URI=<your MongoDB connection string>
JWT_SECRET=<your JWT signing secret>
IMAGEKIT_PRIVATE_KEY=<your ImageKit private key>
```

Create `frontend/.env` if you want to override the defaults in `frontend/.env.example`:

```env
VITE_API_BASE_URL=/api
VITE_SOCKET_URL=http://localhost:3000
```

Run the app in two terminals:

```bash
npm start --prefix backend
```

```bash
npm run dev --prefix frontend
```

The backend listens on `http://localhost:3000`. The frontend runs on `http://localhost:5173` and proxies `/api` plus `/socket.io` to the backend in `frontend/vite.config.js`.

Root convenience scripts are also available:

```bash
npm run dev:backend
npm run dev:frontend
```

Note: `dev:backend` uses `npx nodemon server.js`; `nodemon` is not listed as a backend dependency.

Verified locally:

- `npm ci --prefix backend`
- `npm ci --prefix frontend`
- `npm run build --prefix frontend`
- Backend syntax checks with `node --check`

## API Endpoints

All API paths are mounted under `/api`. Authenticated music routes accept either the `token` cookie set by the auth endpoints or an `Authorization: Bearer <token>` header.

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Create a user or artist. Body: `username`, `email`, `password`, optional `role` (`user` or `artist`). |
| `POST` | `/api/auth/login` | Public | Login by `email` or `username` plus `password`; sets a JWT cookie. |
| `POST` | `/api/auth/logout` | Public | Clears the auth cookie. |
| `GET` | `/api/music` | User or artist | Return up to 20 tracks with populated artist info. |
| `POST` | `/api/music/upload` | Artist only | Upload one audio file in multipart field `music` with a `title`; stores the file through ImageKit. |
| `POST` | `/api/music/album` | Artist only | Create an album from owned track IDs. Body: `title`, `musics` as an array or comma-separated string. |
| `GET` | `/api/music/albums` | User or artist | Return up to 20 albums with artist info. |
| `GET` | `/api/music/albums/:albumId` | User or artist | Return one album with artist and track data. |

Example registration request:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"artist1\",\"email\":\"artist1@example.com\",\"password\":\"password123\",\"role\":\"artist\"}"
```

## Known Limitations

- There is no project `LICENSE` file.
- The backend `test` script is still the default placeholder and exits with `Error: no test specified`.
- The frontend includes Socket.IO room UI and events, but the backend does not create a Socket.IO server yet.
- The frontend tries current-user endpoints such as `/api/auth/me`, plus likes/history/playlists endpoints, but the backend does not implement them. The app falls back to stored session data and `localStorage` for those library features.
- Mood filtering is mostly client-side. The backend does not store a `mood` field or implement `/api/music/mood/:mood`.
- The backend does not configure CORS; local development relies on the Vite proxy.
- Backend error handling is minimal, so invalid IDs, database errors, or ImageKit failures may return raw server errors.
- `PORT` is not configurable; the backend listens on `3000`.
- `bcrypt` is installed in the backend package, but the code uses `bcryptjs`.
- Current `npm ci` output reports audit issues in both dependency trees; run `npm audit` before deploying.
