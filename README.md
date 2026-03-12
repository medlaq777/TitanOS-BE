
# TitanOs Backend

![TitanOs Logo](logo.png)

Sports management REST API built with **Node.js**, **Express**, **Mongoose** (MongoDB), and **Zod**. All HTTP routes are served under **`/api`**. Responses use a fixed shape (`success`, `data`, `message`; errors add `error.code`, and Zod failures may include `error.issues`). Features include offset-based pagination (`limit` / `offset`), JWT + HttpOnly refresh cookies, role guards, teams/sessions/performance, medical records, wellness forms, MinIO media, and fan features (matches, events, actions, articles).

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [API conventions](#api-conventions)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Database (MongoDB / Mongoose)](#database-mongodb--mongoose)
- [API Endpoints](#api-endpoints)
- [Authentication & Authorization](#authentication--authorization)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Docker Setup](#docker-setup)
- [API Documentation](#api-documentation)
- [Observability & operations](#observability--operations)
- [Security](#security)
- [File Storage](#file-storage)

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Runtime | Node.js 20+ (ES modules) |
| Framework | Express 4.18 |
| ODM | Mongoose 8 (MongoDB) |
| Auth | JWT (access) + HttpOnly refresh cookie; bcryptjs |
| Validation | Zod 4 (controllers; `ValidationError.fromZod` for structured issues) |
| File Storage | MinIO (S3-compatible); opaque `objectKey` via `MEDIA_OBJECT_KEY_SECRET` |
| Documentation | Swagger UI (OpenAPI 3.0, dev only) |
| Security | Helmet, express-rate-limit, CORS, express-mongo-sanitize |
| Containerization | Docker + Docker Compose (API + MongoDB + MinIO) |

---

## API conventions

- **Base path:** every REST route is under **`/api`** (for example `GET /api/sport/teams`).
- **Resource IDs:** path and query IDs are **MongoDB ObjectIds** (24 hex characters) unless documented otherwise. Invalid IDs typically surface as **400** (Zod or cast errors).
- **Pagination:** list endpoints accept **`limit`** (1–100, default **10**) and **`offset`** (≥ 0, default **0**). Paginated responses include `meta.hasMore`, `meta.limit`, and `meta.offset`.

---

## Architecture

The backend follows a **layered architecture** like a classic Express API: each repository, service, and controller file exports a **singleton** (`export default new …`) wired with `import` dependencies, and route files expose **`static build()`** that returns an Express `Router` (same idea as [Tirelire-API](https://github.com/medlaq777/Tirelire-API)).

```text
Request → Router → Middleware → Controller → Service → Repository → Mongoose → MongoDB
```

- **Router** — defines routes and applies middleware chains (`static build()` per domain)
- **Controller** — HTTP in/out, Zod `safeParse` + `ValidationError.fromZod` on failure, calls service
- **Service** — business rules, calls repositories
- **Repository** — Mongoose queries and persistence
- **Common** — `errors.js` (`AppError`, `ValidationError.fromZod`), `response.js` (`ApiResponse`)
- **Schemas** — `src/schemas/*.schema.js` — Zod input shapes per domain
- **Models** — `src/models/*.model.js` — Mongoose schemas
- **Routes** — `src/app.js` mounts `*Routes.build()` under `/api`
- **Middlewares** — `auth-guard`, `roles-guard`, `rate-limiter`, `upload`, `error-handler` (404 + centralized errors)

---

## Project Structure

```text
titanos-api/
├── src/
│   ├── app.js                 # Express app: /api, security, Swagger (non-production)
│   ├── server.js              # Listen + MongoDB connect + graceful shutdown
│   ├── common/
│   │   ├── errors.js          # AppError hierarchy; ValidationError.fromZod
│   │   └── response.js        # ApiResponse (success, created, paginated, noContent)
│   ├── config/
│   │   ├── config.js          # Env-based config (Mongo, JWT, MinIO, CORS, …)
│   │   ├── db.js              # Mongoose connect singleton
│   │   └── swagger.js         # OpenAPI 3.0 document
│   ├── controllers/           # One controller per domain
│   ├── services/
│   ├── repositories/
│   ├── schemas/               # Zod request/query/body schemas
│   ├── models/                # Mongoose models
│   ├── middlewares/           # auth-guard, roles-guard, rate-limiter, upload, error-handler
│   ├── routes/                # *Routes.build() per domain
│   └── utils/                 # jwt, bcrypt, minio helpers, pagination, escape-regex
├── seed/
│   └── seed.js                # Demo data (npm run db:seed)
├── Dockerfile
├── docker-compose.yml         # api + mongo + minio
├── .env.example
└── package.json
```

---

## Database (MongoDB / Mongoose)

- **IDs:** MongoDB **ObjectId** (`_id`); API path/query IDs are 24-character hex strings.
- **Collections** are defined in **`src/models/*.model.js`** (User, Team, Member, Session, SessionMember, Performance, MedicalRecord, WellnessForm, Media, Match, MatchEvent, FanAction, Article, TacticalHub, etc.).
- **Enums** below match string enums used in Mongoose and Zod schemas.

| Enum | Values |
| --- | --- |
| `Role` | `ADMIN`, `STAFF`, `PLAYER`, `FAN` |
| `MemberType` | `PLAYER`, `COACH`, `STAFF` |
| `SessionType` | `TRAINING`, `MATCH`, `MEETING` |
| `MatchStatus` | `SCHEDULED`, `LIVE`, `FINISHED`, `CANCELLED` |
| `MatchEventType` | `GOAL`, `YELLOW_CARD`, `RED_CARD`, `SUBSTITUTION`, `INJURY` |
| `FanActionType` | `VOTE`, `TICKET_PURCHASE`, `LIKE`, `SHARE` |
| `ArticleStatus` | `DRAFT`, `PUBLISHED`, `ARCHIVED` |
| `InjuryType` | `MUSCLE`, `LIGAMENT`, `TENDON`, `BONE`, `CONCUSSION`, `JOINT`, `OTHER` |
| `MediaType` | `IMAGE`, `VIDEO`, `DOCUMENT`, `TACTICAL` |
| `MediaAccess` | `PUBLIC`, `PRIVATE`, `TEAM` |
| `TacticalContentType` | `FORMATION`, `PLAY`, `ANALYSIS`, `HIGHLIGHT` |

---

## API Endpoints

All endpoints are prefixed with **`/api`**.

### Auth — `/api/auth`

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/register` | Public | Register a new user |
| POST | `/login` | Public | Login: `accessToken` in body + HttpOnly `refreshToken` cookie |
| POST | `/refresh` | Public | New `accessToken` (reads refresh cookie) |
| GET | `/profile` | Bearer | Current user profile |
| PATCH | `/profile` | Bearer | Update own profile |
| GET | `/users` | Bearer, `ADMIN` | List users (paginated) |
| PATCH | `/users/:id` | Bearer, `ADMIN` | Update user |
| DELETE | `/users/:id` | Bearer, `ADMIN` | Delete user (not self) |
| POST | `/logout` | Bearer | Invalidate refresh token |

### Sport — `/api/sport`

**All routes require Bearer token.**

#### Sport Teams

| Method | Path | Roles | Description |
| --- | --- | --- | --- |
| GET | `/teams` | All | List all teams |
| GET | `/teams/:id` | All | Get team by ID |
| POST | `/teams` | ADMIN, STAFF | Create team |
| PUT | `/teams/:id` | ADMIN, STAFF | Update team |
| DELETE | `/teams/:id` | ADMIN | Delete team |

#### Sport Members

| Method | Path | Roles | Description |
| --- | --- | --- | --- |
| GET | `/members` | All | List all members |
| GET | `/members/:id` | All | Get member by ID |
| POST | `/members` | ADMIN, STAFF | Create member |
| PUT | `/members/:id` | ADMIN, STAFF | Update member |
| DELETE | `/members/:id` | ADMIN | Delete member |
| PATCH | `/members/:id/team` | ADMIN, STAFF | Link member to team |
| DELETE | `/members/:id/team` | ADMIN, STAFF | Unlink member from team |

#### Sport Sessions

| Method | Path | Roles | Description |
| --- | --- | --- | --- |
| GET | `/sessions` | All | List all sessions |
| GET | `/sessions/:id` | All | Get session by ID |
| POST | `/sessions` | ADMIN, STAFF | Create session |
| PUT | `/sessions/:id` | ADMIN, STAFF | Update session |
| DELETE | `/sessions/:id` | ADMIN | Delete session |
| POST | `/sessions/:id/participants` | ADMIN, STAFF | Add participant |
| DELETE | `/sessions/:id/participants/:memberId` | ADMIN, STAFF | Remove participant |
| GET | `/sessions/:id/performances` | All | Get session performances |

#### Sport Performance

| Method | Path | Roles | Description |
| --- | --- | --- | --- |
| GET | `/members/:memberId/stats` | All | Player statistics summary |
| GET | `/members/:memberId/performances` | All | Member performance history |
| GET | `/performances/:id` | All | Get performance by ID |
| POST | `/performances` | ADMIN, STAFF | Create performance record |
| PUT | `/performances/:id` | ADMIN, STAFF | Update performance |
| DELETE | `/performances/:id` | ADMIN | Delete performance |

### Medical — `/api/medical`

**All routes require Bearer token + role `ADMIN` or `STAFF`.**

| Method | Path | Description |
| --- | --- | --- |
| GET | `/records` | List all medical records |
| GET | `/records/:id` | Get record by ID |
| GET | `/records/:id/signed-url` | Generate signed URL for attached file |
| POST | `/records` | Create medical record |
| POST | `/records/:id/files` | Attach file reference to record |
| PUT | `/records/:id` | Update record |
| DELETE | `/records/:id` | Delete record |

### Wellness — `/api/wellness`

**All routes require Bearer token.**

| Method | Path | Roles | Description |
| --- | --- | --- | --- |
| GET | `/forms` | ADMIN, STAFF | List all wellness forms |
| GET | `/forms/:id` | ADMIN, STAFF | Get form by ID |
| GET | `/members/:memberId/recent` | ADMIN, STAFF | Get recent forms for member |
| POST | `/forms` | ADMIN, STAFF, PLAYER | Submit wellness form |
| PUT | `/forms/:id` | ADMIN, STAFF | Update form (HTTP PUT) |
| DELETE | `/forms/:id` | ADMIN | Delete form |

### Media — `/api/media`

**All routes require Bearer token.**

| Method | Path | Roles | Description |
| --- | --- | --- | --- |
| POST | `/upload` | ADMIN, STAFF, PLAYER | Upload file (multipart/form-data) |
| GET | `/` | All | List accessible media |
| GET | `/team/:teamId` | ADMIN, STAFF | Get media by team |
| GET | `/:id` | All | Get media metadata |
| GET | `/:id/presigned-url` | All | Generate presigned URL (15 min default, max 60 min) |
| DELETE | `/:id` | Owner or ADMIN | Delete media |

**Upload fields:** `file` (binary), `type` (IMAGE/VIDEO/DOCUMENT/TACTICAL), `access` (PUBLIC/PRIVATE/TEAM), `teamId` (optional)

### Fan — `/api/fan`

**All routes require Bearer token.**

#### Fan Matches

| Method | Path | Roles | Description |
| --- | --- | --- | --- |
| POST | `/matches` | ADMIN, STAFF | Create match |
| GET | `/matches` | All | List all matches |
| GET | `/matches/:id` | All | Get match with events |
| PATCH | `/matches/:id` | ADMIN, STAFF | Update match score/status |
| DELETE | `/matches/:id` | ADMIN | Delete match |

#### Fan Match Events

| Method | Path | Roles | Description |
| --- | --- | --- | --- |
| POST | `/events` | ADMIN, STAFF | Add match event (goal, card, etc.) |
| PATCH | `/events/:id` | ADMIN, STAFF | Update match event |
| GET | `/matches/:matchId/events` | All | Get match event timeline |
| DELETE | `/events/:id` | ADMIN, STAFF | Delete match event |

#### Fan Actions

| Method | Path | Roles | Description |
| --- | --- | --- | --- |
| POST | `/actions` | All | Submit fan action (vote/like/share/ticket) |
| GET | `/actions/me` | All | Get own fan actions |
| GET | `/matches/:matchId/actions` | ADMIN, STAFF | Get all actions for match |
| GET | `/matches/:matchId/votes` | All | Get match vote counts |

#### Fan Articles

| Method | Path | Roles | Description |
| --- | --- | --- | --- |
| POST | `/articles` | ADMIN, STAFF | Create article |
| GET | `/articles` | All | List published articles |
| GET | `/articles/:id` | All | Get article by ID |
| PATCH | `/articles/:id` | ADMIN, STAFF | Update article |
| DELETE | `/articles/:id` | ADMIN | Delete article |

### Documentation

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/docs` | Public (dev only) | Swagger UI (disabled in `NODE_ENV=production`) |

---

## Authentication & Authorization

### Token Strategy

```text
POST /api/auth/login
  → returns { accessToken } in response body
  → sets refreshToken as HttpOnly cookie (path `/api/auth`)
```

- **Access Token** — short-lived (15 min), sent as `Authorization: Bearer <token>` header
- **Refresh Token** — long-lived (7 days), stored as HttpOnly cookie, hashed in DB

### Token Rotation

```text
POST /api/auth/refresh
  → reads refreshToken from cookie
  → verifies token hash against DB
  → issues new accessToken + new refreshToken (rotation)
```

### Roles

| Role | Description |
| --- | --- |
| `ADMIN` | Full access to all resources |
| `STAFF` | Read/write access; cannot delete certain resources (per route) |
| `PLAYER` | Can submit wellness forms, upload media, view own data |
| `FAN` | Can view public data, submit fan actions |

### Guards

```js
// Route modules use auth guard + role allowlist, e.g.:
r.get("/records", auth, roles.allow("ADMIN", "STAFF"), controller.getAllRecords);
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your values.

See **[.env.example](.env.example)** for the full list. Typical variables:

```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/your_db
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=titanos
MINIO_PUBLIC_URL=http://localhost:9000
MEDIA_OBJECT_KEY_SECRET=at_least_32_chars_random_secret
MAX_FILE_SIZE=52428800
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB 7+ (local or remote URI)
- MinIO optional for local file upload tests (or use Docker Compose)

### Installation

```bash
git clone <repo-url>
cd titanos-api
npm install
cp .env.example .env
# Set MONGODB_URI, JWT secrets, MinIO, MEDIA_OBJECT_KEY_SECRET, etc.

npm run db:seed   # optional: demo users/data (see seed/seed.js)
npm run dev       # or: npm start
```

The server listens on **`PORT`** from `.env` (default **3001**).

### Available Scripts

| Script | Description |
| --- | --- |
| `npm start` | Production server (`node --watch`) |
| `npm run dev` | Dev server with nodemon |
| `npm run db:seed` | Run MongoDB seed script |
| `npm run lint` | ESLint (zero warnings) |

---

## Docker Setup

### Development with Docker Compose

```bash
# Start API + MongoDB + MinIO
docker compose up -d

# View logs
docker compose logs -f api

# Stop services
docker compose down
```

### Docker Services

| Service | Port | Description |
| --- | --- | --- |
| `api` | 3001 | TitanOs backend |
| `mongo` | 27017 | MongoDB (internal; expose if needed) |
| `minio` | 9000 | MinIO S3 storage |
| `minio` (console) | 9001 | MinIO web console |

### Production Build

```bash
# Build image
docker build -t titanos-backend .

# Run container
docker run -p 3001:3001 \
  -e MONGODB_URI=... \
  -e JWT_ACCESS_SECRET=... \
  -e JWT_REFRESH_SECRET=... \
  -e MINIO_ENDPOINT=... \
  titanos-backend
```

The **Dockerfile** uses `node:20-alpine`, runs `npm ci`, copies `src` and `seed`, and starts `node src/server.js`.

---

## API Documentation

Swagger UI is available when **`NODE_ENV` is not `production`** at:

```text
http://localhost:<PORT>/api/docs
```

The spec lives in [src/config/swagger.js](src/config/swagger.js) (OpenAPI 3.0). **POST /auth/login** and **POST /auth/register** include examples aligned with **[seed/seed.js](seed/seed.js)** (use a **new** email for register if the address is already seeded).

---

## Observability & operations

| Concern | Behavior |
| --- | --- |
| **Logging** | MongoDB connect logs a short message to the console; no structured request logger in-repo. Add middleware if you need request logs. |


---

## Security

| Feature | Implementation |
| --- | --- |
| Security headers | `helmet` (14 headers: CSP, HSTS, X-Frame-Options, etc.) |
| Rate limiting | `express-rate-limit` — 100 req/15min global, 10 req/15min for auth; JSON body includes `error.code` (e.g. `RATE_LIMIT`) |
| CORS | Configurable origin (`Config.corsOrigin`); allows `Authorization`, `Content-Type` |
| Password hashing | `bcryptjs` with cost factor 12 |
| Refresh token hashing | `bcryptjs` with cost factor 10 |
| JWT | Short-lived access tokens (15m) + HttpOnly refresh cookie (7d) |
| Input validation | Zod in controllers (`src/schemas`); failures use `ValidationError.fromZod` → optional `error.issues` |
| Role-based access | `roles-guard` where routes require roles |
| x-powered-by | Disabled |
| NoSQL injection | `express-mongo-sanitize` on JSON bodies |

### Error response format

```json
{
  "success": false,
  "data": null,
  "message": "Human-readable summary",
  "error": {
    "code": "VALIDATION_ERROR",
    "issues": [{ "path": "email", "message": "…" }]
  }
}
```

`issues` is present only for Zod validation failures (`ValidationError.fromZod`). Other errors typically have only `error.code` and `message`.

| HTTP Status | Error |
| --- | --- |
| 400 | Validation error, bad request |
| 401 | Missing or invalid token |
| 403 | Insufficient role |
| 404 | Resource not found |
| 409 | Conflict (duplicate) |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

---

## File Storage

Files are stored in MinIO (S3-compatible).

### Upload Flow

```text
Client → POST /api/media/upload (multipart/form-data)
  → Multer parses file into memory (max 50 MB)
  → Validate MIME type (allowlist)
  → Ensure bucket exists
  → Upload to MinIO (opaque object key from media service)
  → Save metadata to DB (Media record)
  → Return media metadata + fileUrl
```

### Supported File Types

| Category | MIME Types |
| --- | --- |
| Images | `image/jpeg`, `image/png`, `image/gif`, `image/webp` |
| Videos | `video/mp4`, `video/quicktime`, `video/x-msvideo` |
| Documents | `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document` |

### Presigned URLs

```text
GET /api/media/:id/presigned-url?expirySeconds=900
```

- Default expiry: 900 seconds (15 minutes)
- Maximum expiry: 3600 seconds (1 hour)
- Access control: ADMIN/STAFF can access any file; PRIVATE files require ownership; TEAM files require team membership

